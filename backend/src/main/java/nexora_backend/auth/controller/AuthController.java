package nexora_backend.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.*;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.pattern.facade.AuthenticationFacade;
import nexora_backend.auth.schema.RegistrationSchemaResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationFacade authenticationFacade;

    @GetMapping("/schema")
    public ResponseEntity<Map<String, RegistrationSchemaResponse>> getRegistrationSchemas() {
        return ResponseEntity.ok(RegistrationSchemaResponse.all());
    }

    @PostMapping("/register/citizen")
    public ResponseEntity<RegistrationResponse> registerCitizen(@Valid @RequestBody CitizenRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authenticationFacade.registerCitizen(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authenticationFacade.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authenticationFacade.refresh(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@Valid @RequestBody OtpVerificationRequest request) {
        authenticationFacade.verifyOtp(request);
        return ResponseEntity.ok(Map.of("message", "OTP verified successfully"));
    }

    @PostMapping("/send-email-verification")
    public ResponseEntity<SendEmailVerificationResponse> sendEmailVerification(
            @Valid @RequestBody SendEmailVerificationRequest request
    ) {
        return ResponseEntity.ok(authenticationFacade.sendEmailVerification(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam("token") String token) {
        authenticationFacade.verifyEmailByToken(token);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<ResendOtpResponse> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        return ResponseEntity.ok(authenticationFacade.resendOtp(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetInitResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authenticationFacade.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authenticationFacade.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        authenticationFacade.changePassword(user, request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @AuthenticationPrincipal AuthenticatedUser user,
            @RequestBody(required = false) LogoutRequest request
    ) {
        authenticationFacade.logout(user, request == null ? new LogoutRequest() : request);
        return ResponseEntity.ok(Map.of("message", "Logged out from current device"));
    }

    @PostMapping("/logout-all")
    public ResponseEntity<Map<String, String>> logoutAll(@AuthenticationPrincipal AuthenticatedUser user) {
        authenticationFacade.logoutAll(user);
        return ResponseEntity.ok(Map.of("message", "Logged out from all devices"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(authenticationFacade.getProfile(user));
    }
}
