package nexora_backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VolunteerWorkerRegistrationRequest {

    @NotBlank(message = "Username is required.")
    private String usernameCreated;

    private String name;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters.")
    private String password;

    private String phoneNumber;

    @NotBlank(message = "Email is required.")
    @Email(message = "Please provide a valid email address.")
    private String email;

    private String profilePic;
}
