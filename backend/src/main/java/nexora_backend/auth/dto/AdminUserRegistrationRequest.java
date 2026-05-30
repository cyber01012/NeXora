package nexora_backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserRegistrationRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String name;

    @NotBlank
    private String contactNumber;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String category;

    @NotNull
    private Long departmentId;
}
