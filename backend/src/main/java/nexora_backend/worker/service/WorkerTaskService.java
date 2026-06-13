package nexora_backend.worker.service;

import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import nexora_backend.database.repository.ForwardedComplaintRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import nexora_backend.shared.exception.BusinessException;
import nexora_backend.worker.dto.response.WorkerTaskResponse;
import nexora_backend.worker.dto.response.WorkerHistoryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkerTaskService {

    private final ForwardedComplaintRepository complaintRepository;
    private final VolunteerWorkerCreatorRepository volunteerRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public WorkerTaskService(ForwardedComplaintRepository complaintRepository,
                             VolunteerWorkerCreatorRepository volunteerRepository,
                             org.springframework.context.ApplicationEventPublisher eventPublisher) {
        this.complaintRepository = complaintRepository;
        this.volunteerRepository = volunteerRepository;
        this.eventPublisher = eventPublisher;
    }

    // ========== READ OPERATIONS ==========

    /** Returns the department ID for the given worker. Throws if worker or dept not found. */
    private Long resolveWorkerDeptId(String workerUsername) {
        return volunteerRepository.findByUsernameCreated(workerUsername)
                .map(w -> {
                    if (w.getDepartment() == null) {
                        throw new BusinessException("Worker has no department assigned", HttpStatus.BAD_REQUEST);
                    }
                    return w.getDepartment().getDeptId();
                })
                .orElseThrow(() -> new BusinessException("Worker not found: " + workerUsername, HttpStatus.NOT_FOUND));
    }

    /** Returns all ForwardedComplaints assigned to this worker in their department. */
    public List<WorkerTaskResponse> getAssignedTasks(String workerUsername) {
        Long deptId = resolveWorkerDeptId(workerUsername);
        return complaintRepository
                .findByWorker_UsernameCreatedAndDepartment_DeptIdOrderBySubmitDateDesc(workerUsername, deptId)
                .stream()
                .filter(c -> Boolean.TRUE.equals(c.getAssignedToWorker()))
                .filter(c -> c.getWorkerDecision() == null) // only active (not completed/rejected)
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    /** Returns tasks assigned but not yet accepted by the worker (same dept). */
    public List<WorkerTaskResponse> getPendingTasks(String workerUsername) {
        Long deptId = resolveWorkerDeptId(workerUsername);
        return complaintRepository
                .findPendingWorkerTasksByDept(workerUsername, deptId)
                .stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    /** Returns tasks accepted and in progress (no final workerDecision), same dept. */
    public List<WorkerTaskResponse> getActiveTasks(String workerUsername) {
        Long deptId = resolveWorkerDeptId(workerUsername);
        return complaintRepository
                .findByWorker_UsernameCreatedAndDepartment_DeptIdAndAcceptedByWorkerTrueAndWorkerDecisionIsNull(workerUsername, deptId)
                .stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());
    }

    /** Returns single task by ID — validates it belongs to this worker AND their department. */
    public WorkerTaskResponse getTask(String workerUsername, Long id) {
        Long deptId = resolveWorkerDeptId(workerUsername);
        ForwardedComplaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Task not found", HttpStatus.NOT_FOUND));

        if (complaint.getWorker() == null ||
                !complaint.getWorker().getUsernameCreated().equals(workerUsername)) {
            throw new BusinessException("You do not have access to this task", HttpStatus.FORBIDDEN);
        }
        if (complaint.getDepartment() == null ||
                !complaint.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("Task does not belong to your department", HttpStatus.FORBIDDEN);
        }

        return toTaskResponse(complaint);
    }

    /** Returns completed and rejected tasks for this worker in their department. */
    public List<WorkerHistoryResponse> getTaskHistory(String workerUsername) {
        Long deptId = resolveWorkerDeptId(workerUsername);
        return complaintRepository
                .findByWorker_UsernameCreatedAndDepartment_DeptIdAndWorkerDecisionIsNotNull(workerUsername, deptId)
                .stream()
                .map(this::toHistoryResponse)
                .collect(Collectors.toList());
    }

    // ========== WRITE OPERATIONS ==========

    /** Worker accepts a task — marks readByWorker, acceptedByWorker, timestamps. */
    @Transactional
    public WorkerTaskResponse acceptTask(String workerUsername, Long id) {
        ForwardedComplaint complaint = getValidatedWorkerComplaint(workerUsername, id);

        if (Boolean.TRUE.equals(complaint.getAcceptedByWorker())) {
            throw new BusinessException("Task already accepted", HttpStatus.BAD_REQUEST);
        }

        complaint.setReadByWorker(true);
        complaint.setReadWorkerDate(LocalDate.now());
        complaint.setReadWorkerTime(LocalTime.now());
        complaint.setAcceptedByWorker(true);
        complaint.setAcceptedDate(LocalDate.now());
        complaint.setAcceptedTime(LocalTime.now());

        return toTaskResponse(complaintRepository.save(complaint));
    }

    /** Worker rejects/declines a task — sets workerDecision = R. */
    @Transactional
    public WorkerTaskResponse rejectTask(String workerUsername, Long id, String reason) {
        ForwardedComplaint complaint = getValidatedWorkerComplaint(workerUsername, id);

        if (complaint.getWorkerDecision() != null) {
            throw new BusinessException("Task already has a final decision", HttpStatus.BAD_REQUEST);
        }

        complaint.setReadByWorker(true);
        complaint.setReadWorkerDate(LocalDate.now());
        complaint.setReadWorkerTime(LocalTime.now());
        complaint.setWorkerDecision(Decision.R);
        complaint.setRemarks(reason != null ? reason : "Rejected by worker");

        return toTaskResponse(complaintRepository.save(complaint));
    }

    /** Worker marks a task complete — sets workerDecision = D. */
    @Transactional
    public WorkerTaskResponse completeTask(String workerUsername, Long id, String remarks) {
        ForwardedComplaint complaint = getValidatedWorkerComplaint(workerUsername, id);

        if (!Boolean.TRUE.equals(complaint.getAcceptedByWorker())) {
            throw new BusinessException("Task must be accepted before it can be completed", HttpStatus.BAD_REQUEST);
        }
        if (complaint.getWorkerDecision() != null) {
            throw new BusinessException("Task already has a final decision", HttpStatus.BAD_REQUEST);
        }

        complaint.setWorkerDecision(Decision.D);
        complaint.setRemarks(remarks != null ? remarks : "Completed by worker");

        eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.TaskDisposedEvent(this, String.valueOf(complaint.getForwardedComplainId())));

        return toTaskResponse(complaintRepository.save(complaint));
    }

    /** Worker starts active work on a task (progress update). */
    @Transactional
    public WorkerTaskResponse startProgress(String workerUsername, Long id, String notes) {
        ForwardedComplaint complaint = getValidatedWorkerComplaint(workerUsername, id);

        complaint.setReadByWorker(true);
        complaint.setReadWorkerDate(LocalDate.now());
        complaint.setReadWorkerTime(LocalTime.now());

        if (notes != null && !notes.isBlank()) {
            String existing = complaint.getRemarks() != null ? complaint.getRemarks() : "";
            complaint.setRemarks(existing + " | Progress: " + notes);
        }

        return toTaskResponse(complaintRepository.save(complaint));
    }

    /** Worker requests help for a task — appends help note to remarks. */
    @Transactional
    public WorkerTaskResponse requestHelp(String workerUsername, Long id, String reason) {
        ForwardedComplaint complaint = getValidatedWorkerComplaint(workerUsername, id);

        String existing = complaint.getRemarks() != null ? complaint.getRemarks() : "";
        complaint.setRemarks(existing + " | HELP REQUESTED: " + (reason != null ? reason : "Assistance needed"));

        return toTaskResponse(complaintRepository.save(complaint));
    }

    // ========== PRIVATE HELPERS ==========


    private ForwardedComplaint getValidatedWorkerComplaint(String workerUsername, Long id) {
        Long deptId = resolveWorkerDeptId(workerUsername);
        ForwardedComplaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Task not found", HttpStatus.NOT_FOUND));

        if (complaint.getWorker() == null ||
                !complaint.getWorker().getUsernameCreated().equals(workerUsername)) {
            throw new BusinessException("You do not have access to this task", HttpStatus.FORBIDDEN);
        }
        if (complaint.getDepartment() == null ||
                !complaint.getDepartment().getDeptId().equals(deptId)) {
            throw new BusinessException("Task does not belong to your department", HttpStatus.FORBIDDEN);
        }

        return complaint;
    }

    private String resolveTaskStatus(ForwardedComplaint c) {
        if (c.getWorkerDecision() == Decision.D) return "COMPLETED";
        if (c.getWorkerDecision() == Decision.R) return "REJECTED";
        if (Boolean.TRUE.equals(c.getAcceptedByWorker())) return "IN_PROGRESS";
        if (Boolean.TRUE.equals(c.getAssignedToWorker())) return "PENDING_ACCEPTANCE";
        return "PENDING";
    }

    private String resolvePriority(ForwardedComplaint c) {
        if (c.getPriority() != null && !c.getPriority().isBlank()) return c.getPriority();
        return c.getSosId() != null ? "HIGH" : "MEDIUM";
    }

    public WorkerTaskResponse toTaskResponse(ForwardedComplaint c) {
        WorkerTaskResponse.Builder b = WorkerTaskResponse.builder()
                .id(c.getForwardedComplainId())
                .reportId(c.getReportId())
                .sosId(c.getSosId())
                .status(resolveTaskStatus(c))
                .priority(resolvePriority(c))
                .remarks(c.getRemarks())
                .submitDate(c.getSubmitDate())
                .submitTime(c.getSubmitTime())
                .assignedDate(c.getAssignedWorkerDate())
                .assignedTime(c.getAssignedWorkerTime())
                .acceptedDate(c.getAcceptedDate())
                .acceptedTime(c.getAcceptedTime());

        if (c.getDepartment() != null) {
            b.departmentName(c.getDepartment().getDeptName())
             .departmentId(c.getDepartment().getDeptId())
             .departmentAddress(c.getDepartment().getDeptAddress());
        }

        if (c.getCitizen() != null) {
            b.citizenName(c.getCitizen().getFullName())
             .citizenPhone(c.getCitizen().getPhoneNumber())
             .anonymous(false);
        } else if (c.getAnonymousReport() != null) {
            b.citizenName("Anonymous")
             .citizenPhone(c.getAnonymousReport().getPhoneNum())
             .anonymous(true);
        }

        if (c.getDeptUser() != null) {
            b.responderUsername(c.getDeptUser().getUsername())
             .responderName(c.getDeptUser().getName());
        }

        return b.build();
    }

    private WorkerHistoryResponse toHistoryResponse(ForwardedComplaint c) {
        String finalDecision = c.getWorkerDecision() == Decision.D ? "COMPLETED" : "REJECTED";

        WorkerHistoryResponse.Builder b = WorkerHistoryResponse.builder()
                .id(c.getForwardedComplainId())
                .reportId(c.getReportId())
                .sosId(c.getSosId())
                .finalDecision(finalDecision)
                .priority(resolvePriority(c))
                .remarks(c.getRemarks())
                .submitDate(c.getSubmitDate())
                .submitTime(c.getSubmitTime())
                .completedDate(c.getAcceptedDate())
                .completedTime(c.getAcceptedTime());

        if (c.getDepartment() != null) {
            b.departmentName(c.getDepartment().getDeptName())
             .departmentId(c.getDepartment().getDeptId());
        }

        if (c.getCitizen() != null) {
            b.citizenName(c.getCitizen().getFullName())
             .citizenPhone(c.getCitizen().getPhoneNumber())
             .anonymous(false);
        } else if (c.getAnonymousReport() != null) {
            b.citizenName("Anonymous")
             .citizenPhone(c.getAnonymousReport().getPhoneNum())
             .anonymous(true);
        }

        if (c.getDeptUser() != null) {
            b.responderName(c.getDeptUser().getName());
        }

        return b.build();
    }
}
