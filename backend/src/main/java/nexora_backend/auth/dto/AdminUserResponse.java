package nexora_backend.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminUserResponse {

    private String username;
    private String name;
    private String email;
    private String contactNumber;

    private Boolean active;
    private String inactiveRemarks;

    private String category;

    private String deptName;

    private String userType;

}
