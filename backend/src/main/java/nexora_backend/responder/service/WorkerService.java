package nexora_backend.responder.service;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import nexora_backend.responder.dto.request.WorkerAddRequest;
import nexora_backend.responder.dto.response.WorkerResponse;
import nexora_backend.responder.mapper.WorkerMapper;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerService {

    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerRepository;
    private final WorkerMapper workerMapper;

    public WorkerService(AdminUserRepository adminUserRepository,
                         VolunteerWorkerCreatorRepository volunteerRepository,
                         WorkerMapper workerMapper) {
        this.adminUserRepository = adminUserRepository;
        this.volunteerRepository = volunteerRepository;
        this.workerMapper = workerMapper;
    }

    // Get all volunteers under responder's department
    public List<WorkerResponse> getWorkers(String username) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        List<VolunteerWorkerCreator> volunteers = volunteerRepository
                .findByDepartmentDeptIdAndActiveTrue(responder.getDepartment().getDeptId());

        return volunteers.stream()
                .map(workerMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Add new volunteer
    @Transactional
    public WorkerResponse addWorker(String responderUsername, WorkerAddRequest request) {
        AdminUser responder = adminUserRepository.findByUsername(responderUsername)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        if (volunteerRepository.existsByUsernameCreated(request.getUsername())) {
            throw new BusinessException("Username already exists");
        }

        VolunteerWorkerCreator volunteer = VolunteerWorkerCreator.builder()
                .usernameCreated(request.getUsername())
                .name(request.getName())
                .password(request.getPassword() != null ? request.getPassword() : "volunteer123")
                .active(true)
                .phoneNumber(request.getPhone())
                .email(request.getEmail())
                .department(responder.getDepartment())
//                .createdDate(LocalDate.now())
                .createdDate(LocalDateTime.now().toLocalDate())
                .build();

        VolunteerWorkerCreator saved = volunteerRepository.save(volunteer);

        return workerMapper.toResponse(saved);
    }

    // Remove volunteer (soft delete)
    @Transactional
    public void removeWorker(String responderUsername, String volunteerUsername) {
        AdminUser responder = adminUserRepository.findByUsername(responderUsername)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        VolunteerWorkerCreator volunteer = volunteerRepository.findByUsernameCreated(volunteerUsername)
                .orElseThrow(() -> new BusinessException("Volunteer not found"));

        if (!volunteer.getDepartment().getDeptId().equals(responder.getDepartment().getDeptId())) {
            throw new BusinessException("You don't have permission to remove this volunteer");
        }

        volunteer.setActive(false);
        volunteerRepository.save(volunteer);
    }
}