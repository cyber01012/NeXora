package nexora_backend.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    private String name;

    private String email;

    private String contactNumber;

    private Boolean active;

    private String inactiveRemarks;
}