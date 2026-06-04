package nexora_backend.responder.mapper;

import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.responder.dto.response.WorkerResponse;
import org.springframework.stereotype.Component;

@Component
public class WorkerMapper {

    public WorkerResponse toResponse(VolunteerWorkerCreator worker) {
        if (worker == null) return null;

        return WorkerResponse.builder()
                .id(null) // VolunteerWorkerCreator doesn't have Long id, uses username as PK
                .username(worker.getUsernameCreated())
                .name(worker.getName())
                .phone(worker.getPhoneNumber())
                .cnic(null) // Not in VolunteerWorkerCreator table
                .role("VOLUNTEER")
                .isActive(worker.getActive() != null ? worker.getActive() : true)
                .createdAt(worker.getCreatedDate() != null ?
                        worker.getCreatedDate().atTime(worker.getCreatedTime()) : null)
                .build();
    }

    public WorkerResponse toResponseWithDepartment(VolunteerWorkerCreator worker, String departmentName) {
        WorkerResponse response = toResponse(worker);
        // Could add department info if needed
        return response;
    }
}