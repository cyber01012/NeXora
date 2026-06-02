package nexora_backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

    @NotBlank(message = "Email, phone number, or username is required.")
    private String identifier;

    @NotBlank(message = "Password is required.")
    private String password;

    private String deviceId;
}
