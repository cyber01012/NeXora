package nexora_backend.responder.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class WorkerResponse {
    private Long id;
    private String username;
    private String name;
    private String phone;
    private String cnic;
    private String role;
    private Boolean isActive;
    private LocalDateTime createdAt;
}