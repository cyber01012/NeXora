package nexora_backend.worker.service;

import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import nexora_backend.shared.exception.BusinessException;
import nexora_backend.worker.dto.response.WorkerProfileResponse;
import nexora_backend.worker.nullobject.IWorker;
import nexora_backend.worker.nullobject.NullWorker;
import nexora_backend.worker.nullobject.VolunteerWorkerAdapter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class WorkerProfileService {

    private final VolunteerWorkerCreatorRepository volunteerRepository;

    public WorkerProfileService(VolunteerWorkerCreatorRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public WorkerProfileResponse getProfile(String workerUsername) {
        // Null Object Pattern: IWorker resolved, never null
        IWorker worker = volunteerRepository.findByUsernameCreated(workerUsername)
                .map(VolunteerWorkerAdapter::new)
                .map(w -> (IWorker) w)
                .orElse(new NullWorker());

        if (worker.isNull()) {
            throw new BusinessException("Worker not found: " + workerUsername, HttpStatus.NOT_FOUND);
        }

        // Cast back to adapter to access entity for dates
        VolunteerWorkerAdapter adapter = (VolunteerWorkerAdapter) worker;
        VolunteerWorkerCreator entity = adapter.getEntity();

        String memberSince = entity.getCreatedDate() != null
                ? entity.getCreatedDate().toString()
                : "N/A";

        return WorkerProfileResponse.builder()
                .username(worker.getUsername())
                .name(worker.getName())
                .email(worker.getEmail())
                .phoneNumber(worker.getPhoneNumber())
                .active(entity.getActive())
                .department(worker.getDepartmentName())
                .departmentId(worker.getDepartmentId())
                .deptAddress(entity.getDepartment() != null ? entity.getDepartment().getDeptAddress() : "")
                .memberSince(memberSince)
                .build();
    }

    @Transactional
    public WorkerProfileResponse updateProfile(String workerUsername, Map<String, Object> updates) {
        VolunteerWorkerCreator entity = volunteerRepository.findByUsernameCreated(workerUsername)
                .orElseThrow(() -> new BusinessException("Worker not found: " + workerUsername, HttpStatus.NOT_FOUND));

        if (updates.containsKey("name")) {
            entity.setName((String) updates.get("name"));
        }
        if (updates.containsKey("email")) {
            entity.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("phoneNumber")) {
            entity.setPhoneNumber((String) updates.get("phoneNumber"));
        }

        volunteerRepository.save(entity);
        return getProfile(workerUsername);
    }
}
