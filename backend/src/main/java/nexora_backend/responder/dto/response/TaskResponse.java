package nexora_backend.responder.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskResponse {
    private Long id;
    private Long forwardedComplaintId;
    private String responderId;
    private String title;
    private String description;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private String priority;
    private String status;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private String workerName;
}