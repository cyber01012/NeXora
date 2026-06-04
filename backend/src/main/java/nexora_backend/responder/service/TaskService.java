package nexora_backend.responder.service;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.enums.Decision;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.ForwardedComplaintRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import nexora_backend.responder.dto.request.RejectRequest;
import nexora_backend.responder.dto.response.TaskResponse;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final ForwardedComplaintRepository forwardedComplaintRepository;
    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerRepository;

    public TaskService(ForwardedComplaintRepository forwardedComplaintRepository,
                       AdminUserRepository adminUserRepository,
                       VolunteerWorkerCreatorRepository volunteerRepository) {
        this.forwardedComplaintRepository = forwardedComplaintRepository;
        this.adminUserRepository = adminUserRepository;
        this.volunteerRepository = volunteerRepository;
    }

    // Get tasks for responder's department
    public List<ForwardedComplaint> getTasks(String username) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        return forwardedComplaintRepository.findByDepartment_DeptIdOrderBySubmitDateDesc(responder.getDepartment().getDeptId());
    }

    // Get single task
    public ForwardedComplaint getTask(Long taskId) {
        return forwardedComplaintRepository.findById(taskId)
                .orElseThrow(() -> new BusinessException("Task not found"));
    }

    // Accept task (updates forwarded_complaint table)
    @Transactional
    public ForwardedComplaint acceptTask(String username, Long complaintId) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found"));

        // Check if task belongs to this responder's department
        if (!complaint.getDepartment().getDeptId().equals(responder.getDepartment().getDeptId())) {
            throw new BusinessException("You don't have access to this task");
        }

        // Update forwarded_complaint table
        complaint.setDeptUser(responder);
        complaint.setReadByDept(true);
        complaint.setReadByDeptDate(LocalDate.now());
        complaint.setReadByDeptTime(LocalTime.now());
        complaint.setDeptDecision(Decision.D);  // D = Accept/Dispose

        return forwardedComplaintRepository.save(complaint);
    }

    // Reject task
    @Transactional
    public ForwardedComplaint rejectTask(String username, Long complaintId, String reason) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found"));

        if (!complaint.getDepartment().getDeptId().equals(responder.getDepartment().getDeptId())) {
            throw new BusinessException("You don't have access to this task");
        }

        complaint.setDeptUser(responder);
        complaint.setReadByDept(true);
        complaint.setDeptDecision(Decision.R);  // R = Reject
        complaint.setRemarks(reason);

        return forwardedComplaintRepository.save(complaint);
    }

    // Forward to volunteer
    @Transactional
    public ForwardedComplaint forwardToVolunteer(String username, Long complaintId, String volunteerUsername) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found"));

        VolunteerWorkerCreator volunteer = volunteerRepository.findByUsernameCreated(volunteerUsername)
                .orElseThrow(() -> new BusinessException("Volunteer not found"));

        complaint.setAssignedToWorker(true);
        complaint.setAssignedWorkerDate(LocalDate.now());
        complaint.setAssignedWorkerTime(LocalTime.now());
        complaint.setWorker(volunteer);

        return forwardedComplaintRepository.save(complaint);
    }

    // Mark as completed
    @Transactional
    public ForwardedComplaint completeTask(String username, Long complaintId) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found"));

        complaint.setWorkerDecision(Decision.D);
        complaint.setAcceptedByWorker(true);
        complaint.setAcceptedDate(LocalDate.now());
        complaint.setAcceptedTime(LocalTime.now());

        return forwardedComplaintRepository.save(complaint);
    }
}