package nexora_backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpVerificationRequest {

    @NotBlank
    private String source;

    @NotBlank
    private String sourceId;

    @NotBlank
    private String purpose;

    @NotBlank
    private String otp;
}
