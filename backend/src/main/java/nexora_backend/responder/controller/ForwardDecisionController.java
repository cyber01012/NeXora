package nexora_backend.responder.controller;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.ForwardDecision;
import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.ForwardDecisionRepository;
import nexora_backend.database.repository.ForwardedComplaintRepository;
import nexora_backend.responder.dto.request.ForwardDecisionRequest;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/responder/field-reports")
public class ForwardDecisionController {

    private final ForwardDecisionRepository forwardDecisionRepository;
    private final ForwardedComplaintRepository forwardedComplaintRepository;
    private final AdminUserRepository adminUserRepository;
    private final RequestContext requestContext;

    public ForwardDecisionController(ForwardDecisionRepository forwardDecisionRepository,
                                     ForwardedComplaintRepository forwardedComplaintRepository,
                                     AdminUserRepository adminUserRepository,
                                     RequestContext requestContext) {
        this.forwardDecisionRepository = forwardDecisionRepository;
        this.forwardedComplaintRepository = forwardedComplaintRepository;
        this.adminUserRepository = adminUserRepository;
        this.requestContext = requestContext;
    }

    @GetMapping
    public ApiResponse<List<ForwardDecision>> getByDepartment() {
        String username = requestContext.getResponderUsername();

        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Responder not found: " + username));

        if (responder.getDepartment() == null) {
            return ApiResponse.ok(List.of());
        }

        Long deptId = responder.getDepartment().getDeptId();

        List<ForwardDecision> evidence = forwardDecisionRepository
                .findByForwardedComplaint_Department_DeptIdOrderByDateDesc(deptId);

        return ApiResponse.ok(evidence);
    }

    @GetMapping("/complaint/{complaintId}")
    public ApiResponse<List<ForwardDecision>> getByComplaint(@PathVariable Long complaintId) {
        List<ForwardDecision> evidence = forwardDecisionRepository
                .findByForwardedComplaint_ForwardedComplainId(complaintId);
        return ApiResponse.ok(evidence);
    }

    @PostMapping
    @Transactional
    public ApiResponse<ForwardDecision> submitEvidence(@RequestBody ForwardDecisionRequest request) {
        ForwardedComplaint complaint = forwardedComplaintRepository
                .findById(request.getForwardedComplainId())
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        ForwardDecision decision = ForwardDecision.builder()
                .forwardedComplaint(complaint)
                .decisionType(Decision.D)
                .evidence(request.getEvidence())
                .description(request.getDescription())
                .date(LocalDate.now())
                .time(LocalTime.now())
                .build();

        return ApiResponse.ok(forwardDecisionRepository.save(decision));
    }

    @PutMapping("/confirm/{complaintId}")
    @Transactional
    public ApiResponse<Void> confirmCompletion(@PathVariable Long complaintId) {
        ForwardedComplaint complaint = forwardedComplaintRepository
                .findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found: " + complaintId));

        complaint.setWorkerDecision(Decision.D);
        complaint.setAcceptedByWorker(true);
        complaint.setAcceptedDate(LocalDate.now());
        complaint.setAcceptedTime(LocalTime.now());
        complaint.setRemarks("Task completed. Evidence verified by responder on " + LocalDate.now());

        forwardedComplaintRepository.save(complaint);

        return ApiResponse.okMessage("Task marked as COMPLETED successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteEvidence(@PathVariable Long id) {
        forwardDecisionRepository.deleteById(id);
        return ApiResponse.okMessage("Evidence deleted");
    }
}