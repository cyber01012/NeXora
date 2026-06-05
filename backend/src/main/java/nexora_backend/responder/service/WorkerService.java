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

import java.time.LocalDate;
import java.time.LocalTime;
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

    private Long getResponderDeptId(String username) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found", HttpStatus.NOT_FOUND));

        if (responder.getDepartment() == null) {
            throw new BusinessException("Responder has no department assigned", HttpStatus.BAD_REQUEST);
        }

        return responder.getDepartment().getDeptId();
    }

    public List<WorkerResponse> getWorkers(String username) {
        Long deptId = getResponderDeptId(username);

        List<VolunteerWorkerCreator> volunteers = volunteerRepository
                .findByDepartmentDeptIdAndActiveTrue(deptId);

        return volunteers.stream()
                .map(workerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkerResponse addWorker(String responderUsername, WorkerAddRequest request) {
        Long deptId = getResponderDeptId(responderUsername);

        if (volunteerRepository.existsByUsernameCreated(request.getUsername())) {
            throw new BusinessException("Username already exists: " + request.getUsername(), HttpStatus.CONFLICT);
        }

        VolunteerWorkerCreator volunteer = new VolunteerWorkerCreator();
        volunteer.setUsernameCreated(request.getUsername());
        volunteer.setName(request.getName());
        volunteer.setPassword(request.getPassword() != null ? request.getPassword() : "volunteer123");
        volunteer.setActive(true);
        volunteer.setPhoneNumber(request.getPhone());
        volunteer.setEmail(request.getEmail());

        AdminUser responder = adminUserRepository.findByUsername(responderUsername)
                .orElseThrow(() -> new BusinessException("Responder not found", HttpStatus.NOT_FOUND));
        volunteer.setDepartment(responder.getDepartment());

        volunteer.setCreatedDate(LocalDate.now());
        volunteer.setCreatedTime(LocalTime.now());

        VolunteerWorkerCreator saved = volunteerRepository.save(volunteer);
        return workerMapper.toResponse(saved);
    }

    @Transactional
    public void removeWorker(String responderUsername, String volunteerUsername) {
        Long deptId = getResponderDeptId(responderUsername);

        VolunteerWorkerCreator volunteer = volunteerRepository.findByUsernameCreated(volunteerUsername)
                .orElseThrow(() -> new BusinessException("Volunteer not found", HttpStatus.NOT_FOUND));

        if (!volunteer.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("You don't have permission to remove this volunteer", HttpStatus.FORBIDDEN);
        }

        volunteer.setActive(false);
        volunteerRepository.save(volunteer);
    }
}