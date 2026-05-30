package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.*;
import nexora_backend.auth.exception.AuthException;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.OtpPurpose;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.pattern.observer.AuthEventPublisher;
import nexora_backend.auth.pattern.observer.EmailVerifiedEvent;
import nexora_backend.auth.pattern.observer.PasswordChangedEvent;
import nexora_backend.auth.security.JwtProvider;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.auth.util.SensitiveDataMasker;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.RegisterCitizenRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Internal authentication operations (login, tokens, password, profile).
 * Registration is handled by Strategy classes via {@link nexora_backend.auth.pattern.facade.AuthenticationFacade}.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final RegisterCitizenRepository registerCitizenRepository;
    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerWorkerCreatorRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final OtpService otpService;
    private final MailService mailService;
    private final RefreshTokenService refreshTokenService;
    private final JwtProvider jwtProvider;
    private final UserLookupService userLookupService;
    private final EmailVerificationService emailVerificationService;
    private final AuthEventPublisher authEventPublisher;

    @Value("${jwt.expiration}")
    private long accessTokenExpirationMs;

    public AuthResponse login(LoginRequest request) {
        AuthenticatedUser user = userLookupService.findByIdentifier(request.getIdentifier());
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        if (!user.isEnabled()) {
            throw new AuthException(HttpStatus.FORBIDDEN, "Account is inactive");
        }
        emailVerificationService.requireEmailVerifiedForLogin(user.getSource(), user.getSourceId(), user.getRole());
        return buildAuthResponse(user, request.getDeviceId());
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        var claims = jwtProvider.parseClaims(request.getRefreshToken());
        if (!"refresh".equals(claims.get("tokenType"))) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Invalid refresh token");
        }

        RefreshRotationResult rotation = refreshTokenService.validateAndRotate(request.getRefreshToken());
        AuthenticatedUser user = rotation.user();
        String accessToken = jwtProvider.generateAccessToken(user);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rotation.refreshToken())
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirationMs / 1000)
                .user(getProfile(user))
                .build();
    }

    @Transactional
    public void verifyOtp(OtpVerificationRequest request) {
        UserSource source = UserSource.valueOf(request.getSource());
        OtpPurpose purpose = OtpPurpose.valueOf(request.getPurpose());
        otpService.verifyOtp(source, request.getSourceId(), purpose, request.getOtp());

        if (purpose == OtpPurpose.EMAIL_VERIFICATION) {
            emailVerificationService.markEmailVerified(source, request.getSourceId());
            AuthenticatedUser user = userLookupService.findBySource(source, request.getSourceId());
            authEventPublisher.publish(EmailVerifiedEvent.builder()
                    .source(source)
                    .sourceId(request.getSourceId())
                    .role(user.getRole())
                    .email(user.getEmail())
                    .displayName(user.getDisplayName())
                    .occurredAt(Instant.now())
                    .build());
        }
    }

    public ResendOtpResponse resendOtp(ResendOtpRequest request) {
        UserSource source = UserSource.valueOf(request.getSource());
        OtpPurpose purpose = OtpPurpose.valueOf(request.getPurpose());
        OtpResendResult result = otpService.resendOtp(source, request.getSourceId(), purpose, request.getEmail());
        mailService.sendOtpEmail(
                request.getEmail(),
                result.otp(),
                purpose == OtpPurpose.PASSWORD_RESET ? "Password Reset" : "Email Verification"
        );
        return ResendOtpResponse.builder()
                .message("OTP resent successfully")
                .remainingResends(result.remainingResends())
                .build();
    }

    public PasswordResetInitResponse forgotPassword(ForgotPasswordRequest request) {
        AuthenticatedUser user = userLookupService.findByEmail(request.getEmail());
        if (user.getRole() == SystemRole.CITIZEN && (user.getEmail() == null || user.getEmail().isBlank())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Password recovery requires a registered email");
        }
        String otp = otpService.generateAndStoreOtp(user.getSource(), user.getSourceId(), OtpPurpose.PASSWORD_RESET, request.getEmail());
        mailService.sendPasswordResetOtpEmail(request.getEmail(), otp);
        return PasswordResetInitResponse.builder()
                .message("Password reset OTP sent to email")
                .source(user.getSource())
                .sourceId(user.getSourceId())
                .build();
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        UserSource source = UserSource.valueOf(request.getSource());
        otpService.verifyOtp(source, request.getSourceId(), OtpPurpose.PASSWORD_RESET, request.getOtp());
        String encoded = passwordEncoder.encode(request.getNewPassword());
        userLookupService.updatePassword(source, request.getSourceId(), encoded);
        refreshTokenService.revokeAllTokens(source, request.getSourceId());
    }

    @Transactional
    public void changePassword(AuthenticatedUser user, ChangePasswordRequest request) {
        AuthenticatedUser storedUser = userLookupService.findBySource(user.getSource(), user.getSourceId());
        if (!passwordEncoder.matches(request.getCurrentPassword(), storedUser.getPasswordHash())) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        userLookupService.updatePassword(user.getSource(), user.getSourceId(), passwordEncoder.encode(request.getNewPassword()));
        refreshTokenService.revokeAllTokens(user.getSource(), user.getSourceId());

        AuthenticatedUser updatedUser = userLookupService.findBySource(user.getSource(), user.getSourceId());
        authEventPublisher.publish(PasswordChangedEvent.builder()
                .source(updatedUser.getSource())
                .sourceId(updatedUser.getSourceId())
                .role(updatedUser.getRole())
                .email(updatedUser.getEmail())
                .occurredAt(Instant.now())
                .build());
    }

    public void logout(AuthenticatedUser user, LogoutRequest request) {
        if (request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
            refreshTokenService.revokeToken(request.getRefreshToken());
        }
    }

    public void logoutAll(AuthenticatedUser user) {
        refreshTokenService.revokeAllTokens(user.getSource(), user.getSourceId());
    }

    public UserProfileResponse getProfile(AuthenticatedUser user) {
        return switch (user.getSource()) {
            case CITIZEN -> {
                RegisterCitizen citizen = registerCitizenRepository.findById(Long.parseLong(user.getSourceId()))
                        .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Citizen not found"));
                boolean emailVerified = Boolean.TRUE.equals(citizen.getEmailVerified());
                yield UserProfileResponse.builder()
                        .identifier(user.getIdentifier())
                        .sourceId(user.getSourceId())
                        .source(user.getSource())
                        .role(user.getRole())
                        .displayName(citizen.getFullName())
                        .email(citizen.getEmail())
                        .maskedPhone(SensitiveDataMasker.maskPhone(encryptionService.decrypt(citizen.getPhoneNumber())))
                        .maskedCnic(citizen.getCnic() == null ? null : SensitiveDataMasker.maskCnic(encryptionService.decrypt(citizen.getCnic())))
                        .active(true)
                        .emailVerified(emailVerified)
                        .verifiedCitizenBadge(emailVerified)
                        .build();
            }
            case ADMIN_USER -> {
                AdminUser admin = adminUserRepository.findById(user.getSourceId())
                        .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Admin user not found"));
                boolean emailVerified = Boolean.TRUE.equals(admin.getEmailVerified());
                yield UserProfileResponse.builder()
                        .identifier(user.getIdentifier())
                        .sourceId(user.getSourceId())
                        .source(user.getSource())
                        .role(user.getRole())
                        .displayName(admin.getName())
                        .email(admin.getEmail())
                        .maskedPhone(SensitiveDataMasker.maskPhone(encryptionService.decrypt(admin.getContactNumber())))
                        .active(admin.getActive())
                        .emailVerified(emailVerified)
                        .verifiedCitizenBadge(false)
                        .build();
            }
            case VOLUNTEER_WORKER -> {
                VolunteerWorkerCreator worker = volunteerWorkerCreatorRepository.findById(user.getSourceId())
                        .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Volunteer/Worker not found"));
                boolean emailVerified = Boolean.TRUE.equals(worker.getEmailVerified());
                yield UserProfileResponse.builder()
                        .identifier(user.getIdentifier())
                        .sourceId(user.getSourceId())
                        .source(user.getSource())
                        .role(user.getRole())
                        .displayName(worker.getName())
                        .email(worker.getEmail())
                        .maskedPhone(worker.getPhoneNumber() == null ? null : SensitiveDataMasker.maskPhone(encryptionService.decrypt(worker.getPhoneNumber())))
                        .active(worker.getActive())
                        .emailVerified(emailVerified)
                        .verifiedCitizenBadge(false)
                        .build();
            }
        };
    }

    private AuthResponse buildAuthResponse(AuthenticatedUser user, String deviceId) {
        String resolvedDeviceId = deviceId == null || deviceId.isBlank() ? UUID.randomUUID().toString() : deviceId;
        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshToken = refreshTokenService.issueRefreshToken(user, resolvedDeviceId);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpirationMs / 1000)
                .user(getProfile(user))
                .build();
    }
}
