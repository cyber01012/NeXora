package nexora_backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {

    @NotBlank(message = "Account source is required.")
    private String source;

    @NotBlank(message = "Account identifier is required.")
    private String sourceId;

    @NotBlank(message = "OTP code is required.")
    private String otp;

    @NotBlank(message = "New password is required.")
    @Size(min = 8, max = 128, message = "New password must be between 8 and 128 characters.")
    private String newPassword;
}
