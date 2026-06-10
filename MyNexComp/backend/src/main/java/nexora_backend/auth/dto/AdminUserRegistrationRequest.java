package nexora_backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminUserRegistrationRequest {

    @NotBlank(message = "Username is required.")
    private String username;

    @NotBlank(message = "Name is required.")
    private String name;

    @NotBlank(message = "Contact number is required.")
    private String contactNumber;

    @NotBlank(message = "Email is required.")
    @Email(message = "Please provide a valid email address.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters.")
    private String password;

    private String category;

    // ✅ NEW
    private Long deptId;
    // ✅ NEW
    private Boolean active;

    // ✅ NEW
    private String inactiveRemarks;


    private String responderTypeId;
}
