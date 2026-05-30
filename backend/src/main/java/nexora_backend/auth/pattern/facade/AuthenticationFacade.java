package nexora_backend.auth.pattern.facade;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.*;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.pattern.factory.RegistrationStrategyFactory;
import nexora_backend.auth.pattern.observer.AuthEventPublisher;
import nexora_backend.auth.pattern.observer.UserRegisteredEvent;
import nexora_backend.auth.pattern.strategy.RegistrationContext;
import nexora_backend.auth.service.AuthService;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Facade Pattern — single simplified entry point for authentication operations.
 * Controllers depend on this class instead of individual services and strategies.
 */
@Component
@RequiredArgsConstructor
public class AuthenticationFacade {

    private final RegistrationStrategyFactory registrationStrategyFactory;
    private final AuthService authService;
    private final AuthEventPublisher authEventPublisher;

    public RegistrationResponse register(SystemRole role, RegistrationContext context) {
        RegistrationResponse response = registrationStrategyFactory.getStrategy(role).register(context);
        authEventPublisher.publish(UserRegisteredEvent.builder()
                .role(role)
                .source(response.getSource())
                .sourceId(response.getSourceId())
                .occurredAt(Instant.now())
                .build());
        return response;
    }

    public RegistrationResponse registerCitizen(CitizenRegistrationRequest request) {
        return register(SystemRole.CITIZEN, RegistrationContext.forCitizen(request));
    }

    public RegistrationResponse registerAdminPortalUser(
            SystemRole targetRole,
            AdminUserRegistrationRequest request,
            AuthenticatedUser creator
    ) {
        return register(targetRole, RegistrationContext.forAdminPortal(targetRole, request, creator));
    }

    public RegistrationResponse registerVolunteer(
            VolunteerWorkerRegistrationRequest request,
            AuthenticatedUser creator
    ) {
        return register(SystemRole.VOLUNTEER, RegistrationContext.forVolunteer(request, creator));
    }

    public RegistrationResponse registerWorker(
            VolunteerWorkerRegistrationRequest request,
            AuthenticatedUser creator
    ) {
        return register(SystemRole.WORKER, RegistrationContext.forWorker(request, creator));
    }

    public AuthResponse login(LoginRequest request) {
        return authService.login(request);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        return authService.refresh(request);
    }

    public void verifyOtp(OtpVerificationRequest request) {
        authService.verifyOtp(request);
    }

    public ResendOtpResponse resendOtp(ResendOtpRequest request) {
        return authService.resendOtp(request);
    }

    public PasswordResetInitResponse forgotPassword(ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    public void resetPassword(ResetPasswordRequest request) {
        authService.resetPassword(request);
    }

    public void changePassword(AuthenticatedUser user, ChangePasswordRequest request) {
        authService.changePassword(user, request);
    }

    public void logout(AuthenticatedUser user, LogoutRequest request) {
        authService.logout(user, request);
    }

    public void logoutAll(AuthenticatedUser user) {
        authService.logoutAll(user);
    }

    public UserProfileResponse getProfile(AuthenticatedUser user) {
        return authService.getProfile(user);
    }
}
