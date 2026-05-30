package nexora_backend.auth.pattern.strategy;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.CitizenRegistrationRequest;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.exception.AuthException;
import nexora_backend.auth.model.OtpPurpose;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.service.MailService;
import nexora_backend.auth.service.OtpService;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.repository.RegisterCitizenRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Strategy Pattern — citizen self-registration from the landing page.
 */
@Component
@RequiredArgsConstructor
public class CitizenRegistrationStrategy implements RegistrationStrategy {

    private final RegisterCitizenRepository registerCitizenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final OtpService otpService;
    private final MailService mailService;

    @Override
    public SystemRole supportedRole() {
        return SystemRole.CITIZEN;
    }

    @Override
    @Transactional
    public RegistrationResponse register(RegistrationContext context) {
        CitizenRegistrationRequest request = context.getCitizenRequest();
        if (request == null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Citizen registration request is required");
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && registerCitizenRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AuthException(HttpStatus.CONFLICT, "Email already registered");
        }
        if (registerCitizenRepository.existsByPhoneNumber(encryptionService.encrypt(request.getPhoneNumber()))) {
            throw new AuthException(HttpStatus.CONFLICT, "Phone number already registered");
        }
        if (request.getCnic() != null && !request.getCnic().isBlank()
                && registerCitizenRepository.existsByCnic(encryptionService.encrypt(request.getCnic()))) {
            throw new AuthException(HttpStatus.CONFLICT, "CNIC already registered");
        }

        boolean hasEmail = request.getEmail() != null && !request.getEmail().isBlank();

        RegisterCitizen citizen = RegisterCitizen.builder()
                .fullName(request.getFullName())
                .phoneNumber(encryptionService.encrypt(request.getPhoneNumber()))
                .address(request.getAddress())
                .city(request.getCity())
                .email(hasEmail ? request.getEmail() : null)
                .cnic(request.getCnic() == null || request.getCnic().isBlank()
                        ? null
                        : encryptionService.encrypt(request.getCnic()))
                .password(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .entryDate(LocalDate.now())
                .entryTime(LocalTime.now())
                .build();

        citizen = registerCitizenRepository.save(citizen);
        String sourceId = String.valueOf(citizen.getId());

        if (hasEmail) {
            String otp = otpService.generateAndStoreOtp(
                    UserSource.CITIZEN, sourceId, OtpPurpose.EMAIL_VERIFICATION, request.getEmail());
            mailService.sendOtpEmail(request.getEmail(), otp, "Email Verification");
        }

        return RegistrationResponse.builder()
                .message(hasEmail
                        ? "Citizen registered. Verify email with OTP to receive the Verified Citizen badge."
                        : "Citizen registered successfully.")
                .source(UserSource.CITIZEN)
                .sourceId(sourceId)
                .emailVerificationRequired(hasEmail)
                .build();
    }
}
