package nexora_backend.assigningofficer.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DispatchRequest {

    /** "SOS" or "CIVIC" */
    @NotNull
    private String reportType;

    /** sosId or civicId depending on reportType */
    @NotNull
    private Long reportId;

    /** Target department to forward to */
    @NotNull
    private Long departmentId;

    /** HIGH, MEDIUM, LOW */
    private String priority;

    /** Optional AO remarks */
    private String remarks;
}
