package nexora_backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpVerificationRequest {

    @NotBlank(message = "Account source is required.")
    private String source;

    @NotBlank(message = "Account identifier is required.")
    private String sourceId;

    @NotBlank(message = "OTP purpose is required.")
    private String purpose;

    @NotBlank(message = "OTP code is required.")
    private String otp;
}
