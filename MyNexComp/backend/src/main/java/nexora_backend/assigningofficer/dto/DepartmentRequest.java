package nexora_backend.assigningofficer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentRequest {

    @NotBlank
    private String deptName;

    /** "NGO" or "GOV" */
    @NotBlank
    private String responderTypeCategory;

    private String focalPersonName;

    private String focalPersonNumber;

    private String deptAddress;

    private String deptEmail;

    /** FK to ResponderType id */
    private String responderTypeId;
}
