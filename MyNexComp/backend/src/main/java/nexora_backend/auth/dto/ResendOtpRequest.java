package nexora_backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResendOtpRequest {

    @NotBlank(message = "Account source is required.")
    private String source;

    @NotBlank(message = "Account identifier is required.")
    private String sourceId;

    @NotBlank(message = "OTP purpose is required.")
    private String purpose;

    @NotBlank(message = "Email is required.")
    @Email(message = "Please provide a valid email address.")
    private String email;
}
