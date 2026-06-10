
package nexora_backend.responder.service;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.CivicReport;
import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.enums.Decision;
import nexora_backend.database.repository.*;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskService {

    private final ForwardedComplaintRepository forwardedComplaintRepository;
    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerRepository;
    private final CivicReportRepository civicReportRepository;
    private final SOSReportRepository sosReportRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public TaskService(ForwardedComplaintRepository forwardedComplaintRepository,
                       AdminUserRepository adminUserRepository,
                       VolunteerWorkerCreatorRepository volunteerRepository,
                       CivicReportRepository civicReportRepository,
                       SOSReportRepository sosReportRepository,
                       org.springframework.context.ApplicationEventPublisher eventPublisher) {
        this.forwardedComplaintRepository = forwardedComplaintRepository;
        this.adminUserRepository = adminUserRepository;
        this.volunteerRepository = volunteerRepository;
        this.civicReportRepository = civicReportRepository;
        this.sosReportRepository = sosReportRepository;
        this.eventPublisher = eventPublisher;
    }

    private Long getResponderDeptId(String username) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found", HttpStatus.NOT_FOUND));

        if (responder.getDepartment() == null) {
            throw new BusinessException("Responder has no department assigned", HttpStatus.BAD_REQUEST);
        }

        return responder.getDepartment().getDeptId();
    }

    public List<ForwardedComplaint> getAllTasks(String username) {
        Long deptId = getResponderDeptId(username);
        return forwardedComplaintRepository.findByDepartment_DeptIdOrderBySubmitDateDesc(deptId);
    }

    public List<ForwardedComplaint> getPendingTasks(String username) {
        Long deptId = getResponderDeptId(username);
        return forwardedComplaintRepository.findByDepartment_DeptIdAndDeptDecisionIsNull(deptId);
    }

    public List<ForwardedComplaint> getActiveTasks(String username) {
        Long deptId = getResponderDeptId(username);
        return forwardedComplaintRepository.findByDepartment_DeptIdAndDeptDecisionAndWorkerDecisionIsNull(deptId, Decision.D);
    }

    public List<ForwardedComplaint> getHistoryTasks(String username) {
        Long deptId = getResponderDeptId(username);
        List<ForwardedComplaint> completed = forwardedComplaintRepository
                .findByDepartment_DeptIdAndWorkerDecision(deptId, Decision.D);
        List<ForwardedComplaint> rejected = forwardedComplaintRepository
                .findByDepartment_DeptIdAndDeptDecision(deptId, Decision.R);

        List<ForwardedComplaint> history = new ArrayList<>();
        history.addAll(completed);
        history.addAll(rejected);

        history.sort((a, b) -> {
            if (a.getSubmitDate() == null) return 1;
            if (b.getSubmitDate() == null) return -1;
            return b.getSubmitDate().compareTo(a.getSubmitDate());
        });

        return history;
    }

    public ForwardedComplaint getTask(Long taskId) {
        return forwardedComplaintRepository.findById(taskId)
                .orElseThrow(() -> new BusinessException("Task not found", HttpStatus.NOT_FOUND));
    }

    @Transactional
    public ForwardedComplaint acceptTask(String username, Long complaintId) {
        Long deptId = getResponderDeptId(username);
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found", HttpStatus.NOT_FOUND));

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found", HttpStatus.NOT_FOUND));

        if (!complaint.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("You don't have access to this task", HttpStatus.FORBIDDEN);
        }

        complaint.setDeptUser(responder);
        complaint.setReadByDept(true);
        complaint.setReadByDeptDate(LocalDate.now());
        complaint.setReadByDeptTime(LocalTime.now());
        complaint.setDeptDecision(Decision.D);
        complaint.setRemarks("Task accepted by " + username);

        updateCivicReportStatus(complaint.getReportId(), "COMPLETED");
        eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.TaskAcceptedEvent(this, String.valueOf(complaint.getForwardedComplainId())));
        return forwardedComplaintRepository.save(complaint);
    }
    @Transactional
    public ForwardedComplaint rejectTask(String username, Long complaintId, String reason) {
        Long deptId = getResponderDeptId(username);
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found", HttpStatus.NOT_FOUND));

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found", HttpStatus.NOT_FOUND));

        if (!complaint.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("You don't have access to this task", HttpStatus.FORBIDDEN);
        }

        complaint.setDeptUser(responder);
        complaint.setReadByDept(true);
        complaint.setReadByDeptDate(LocalDate.now());
        complaint.setReadByDeptTime(LocalTime.now());
        complaint.setDeptDecision(Decision.R);
        complaint.setRemarks(reason);

        updateCivicReportStatus(complaint.getReportId(), "REJECTED");
        
        if (complaint.getReportId() != null) {
            civicReportRepository.findById(complaint.getReportId()).ifPresent(report -> {
                eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.ReportRejectedByDeptEvent(this, report));
            });
        } else {
            eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.TaskRejectedEvent(this, String.valueOf(complaint.getForwardedComplainId())));
        }

        return forwardedComplaintRepository.save(complaint);
    }

    @Transactional
    public ForwardedComplaint assignToVolunteer(String username, Long complaintId, String volunteerUsername) {
        Long deptId = getResponderDeptId(username);

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found", HttpStatus.NOT_FOUND));

        if (!complaint.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("You don't have access to this task", HttpStatus.FORBIDDEN);
        }

        VolunteerWorkerCreator volunteer = volunteerRepository.findByUsernameCreated(volunteerUsername)
                .orElseThrow(() -> new BusinessException("Volunteer not found", HttpStatus.NOT_FOUND));

        if (!volunteer.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("Volunteer does not belong to your department", HttpStatus.FORBIDDEN);
        }

        if (!Boolean.TRUE.equals(volunteer.getActive())) {
            throw new BusinessException("Volunteer is not active", HttpStatus.BAD_REQUEST);
        }

        complaint.setAssignedToWorker(true);
        complaint.setAssignedWorkerDate(LocalDate.now());
        complaint.setAssignedWorkerTime(LocalTime.now());
        complaint.setWorker(volunteer);
        complaint.setRemarks("Assigned to volunteer: " + volunteer.getName());

        return forwardedComplaintRepository.save(complaint);
    }

    @Transactional
    public ForwardedComplaint confirmCompletion(String username, Long complaintId, String remarks) {
        Long deptId = getResponderDeptId(username);

        ForwardedComplaint complaint = forwardedComplaintRepository.findById(complaintId)
                .orElseThrow(() -> new BusinessException("Task not found", HttpStatus.NOT_FOUND));

        if (!complaint.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("You don't have access to this task", HttpStatus.FORBIDDEN);
        }

        if (!Boolean.TRUE.equals(complaint.getAssignedToWorker())) {
            throw new BusinessException("Task was not assigned to any volunteer", HttpStatus.BAD_REQUEST);
        }

        complaint.setWorkerDecision(Decision.D);
        complaint.setAcceptedByWorker(true);
        complaint.setAcceptedDate(LocalDate.now());
        complaint.setAcceptedTime(LocalTime.now());
        complaint.setRemarks(remarks);

        if (complaint.getReportId() != null) {
            civicReportRepository.findById(complaint.getReportId()).ifPresent(report -> {
                report.setStatus("COMPLETED");
                civicReportRepository.save(report);
                eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.ReportCompletedEvent(this, report));
            });
        }
        if (complaint.getSosId() != null) {
            sosReportRepository.findById(complaint.getSosId()).ifPresent(sos -> {
                sos.setStatus("COMPLETED");
                sosReportRepository.save(sos);
                eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.TaskDisposedEvent(this, "SOS-" + sos.getSosId()));
            });
        }
        return forwardedComplaintRepository.save(complaint);
    }

    private void updateCivicReportStatus(Long reportId, String status) {
        if (reportId != null) {
            CivicReport civicReport = civicReportRepository.findById(reportId).orElse(null);
            if (civicReport != null) {
                civicReport.setStatus(status);
                civicReportRepository.save(civicReport);
            }
        }
    }
}