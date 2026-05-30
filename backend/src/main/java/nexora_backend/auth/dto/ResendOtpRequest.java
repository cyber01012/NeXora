package nexora_backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResendOtpRequest {

    @NotBlank
    private String source;

    @NotBlank
    private String sourceId;

    @NotBlank
    private String purpose;

    @NotBlank
    @Email
    private String email;
}
