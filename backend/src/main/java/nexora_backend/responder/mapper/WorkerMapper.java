package nexora_backend.responder.mapper;

import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.responder.dto.response.WorkerResponse;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class WorkerMapper {

    public WorkerResponse toResponse(VolunteerWorkerCreator worker) {
        if (worker == null) return null;

        WorkerResponse response = new WorkerResponse();
        response.setUsername(worker.getUsernameCreated());
        response.setName(worker.getName());
        response.setPhone(worker.getPhoneNumber());
        response.setRole("VOLUNTEER");
        response.setIsActive(worker.getActive() != null ? worker.getActive() : true);
        response.setTasksCompleted(0);

        if (worker.getCreatedDate() != null && worker.getCreatedTime() != null) {
            response.setCreatedAt(LocalDateTime.of(worker.getCreatedDate(), worker.getCreatedTime()));
        } else if (worker.getCreatedDate() != null) {
            response.setCreatedAt(worker.getCreatedDate().atStartOfDay());
        }

        return response;
    }
}