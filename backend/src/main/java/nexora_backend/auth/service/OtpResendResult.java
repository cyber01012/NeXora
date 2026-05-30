package nexora_backend.auth.service;

public record OtpResendResult(String otp, int remainingResends) {
}
