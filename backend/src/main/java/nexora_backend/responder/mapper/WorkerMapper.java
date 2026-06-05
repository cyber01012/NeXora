package nexora_backend.responder.mapper;

import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.responder.dto.response.WorkerResponse;
import org.springframework.stereotype.Component;

@Component
public class WorkerMapper {

    public WorkerResponse toResponse(VolunteerWorkerCreator worker) {
        if (worker == null) return null;

        WorkerResponse response = new WorkerResponse();
        response.setId(null); // VolunteerWorkerCreator doesn't have Long id, uses username as PK
        response.setUsername(worker.getUsernameCreated());
        response.setName(worker.getName());
        response.setPhone(worker.getPhoneNumber());
        response.setCnic(null); // Not in VolunteerWorkerCreator table
        response.setRole("VOLUNTEER");
        response.setIsActive(worker.getActive() != null ? worker.getActive() : true);
        response.setCreatedAt(worker.getCreatedDate() != null ?
                worker.getCreatedDate().atTime(worker.getCreatedTime()) : null);

        return response;
    }

    public WorkerResponse toResponseWithDepartment(VolunteerWorkerCreator worker, String departmentName) {
        WorkerResponse response = toResponse(worker);
        // Could add department info if needed
        return response;
    }
}