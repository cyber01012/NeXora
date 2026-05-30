package nexora_backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VolunteerWorkerRegistrationRequest {

    @NotBlank
    private String usernameCreated;

    private String name;

    @NotBlank
    private String password;

    private String phoneNumber;

    @NotBlank
    @Email
    private String email;

    private String profilePic;
}
