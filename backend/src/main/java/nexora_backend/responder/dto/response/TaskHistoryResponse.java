package nexora_backend.responder.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TaskHistoryResponse {
    private Long id;
    private Long taskId;
    private String taskTitle;
    private String action;
    private String performedBy;
    private String notes;
    private LocalDateTime createdAt;
}