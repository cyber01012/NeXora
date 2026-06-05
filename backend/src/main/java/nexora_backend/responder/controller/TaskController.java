package nexora_backend.responder.controller;

import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import nexora_backend.responder.service.TaskService;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/responder")
public class TaskController {

    private final TaskService taskService;
    private final RequestContext requestContext;

    public TaskController(TaskService taskService,
                          RequestContext requestContext) {
        this.taskService = taskService;
        this.requestContext = requestContext;
    }

    // ========== GET TASKS ==========

    @GetMapping("/tasks")
    public ApiResponse<List<Map<String, Object>>> getTasks(@RequestParam(required = false) String status) {
        String username = requestContext.getResponderUsername();

        List<ForwardedComplaint> complaints = taskService.getTasks(username);

        List<Map<String, Object>> tasks = complaints.stream()
                .filter(c -> {
                    String taskStatus = getTaskStatus(c);
                    if ("PENDING".equals(status)) {
                        return "PENDING".equals(taskStatus);
                    } else if ("ACTIVE".equals(status)) {
                        return "ACCEPTED".equals(taskStatus) || "WITH_VOLUNTEER".equals(taskStatus);
                    }
                    return true;
                })
                .map(this::toTaskResponse)
                .collect(Collectors.toList());

        return ApiResponse.ok(tasks);
    }

    @GetMapping("/tasks/{id}")
    public ApiResponse<Map<String, Object>> getTaskDetails(@PathVariable Long id) {
        ForwardedComplaint complaint = taskService.getTask(id);
        return ApiResponse.ok(toTaskResponse(complaint));
    }

    // ========== RESPONDER ACCEPTS TASK ==========

    @PostMapping("/tasks/{id}/accept")
    public ApiResponse<Void> acceptTask(@PathVariable Long id) {
        String username = requestContext.getResponderUsername();
        taskService.acceptTask(username, id);
        return ApiResponse.okMessage("Task accepted. Status: ACCEPTED");
    }

    // ========== RESPONDER REJECTS TASK ==========

    @PostMapping("/tasks/{id}/reject")
    public ApiResponse<Void> rejectTask(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String username = requestContext.getResponderUsername();
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "No reason provided";
        taskService.rejectTask(username, id, reason);
        return ApiResponse.okMessage("Task rejected");
    }

    // ========== RESPONDER ASSIGNS TASK TO VOLUNTEER ==========

    @PutMapping("/tasks/{id}/assign-volunteer")
    public ApiResponse<Void> assignToVolunteer(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String username = requestContext.getResponderUsername();
        String volunteerUsername = body.get("volunteerUsername");

        if (volunteerUsername == null || volunteerUsername.isBlank()) {
            return ApiResponse.error("Volunteer username is required");
        }

        taskService.forwardToVolunteer(username, id, volunteerUsername);

        return ApiResponse.okMessage("Task assigned to volunteer");
    }

    // ========== RESPONDER VIEWS VOLUNTEER'S EVIDENCE ==========

    @GetMapping("/tasks/{id}/evidence")
    public ApiResponse<Map<String, Object>> getTaskEvidence(@PathVariable Long id) {
        ForwardedComplaint complaint = taskService.getTask(id);

        Map<String, Object> evidence = new HashMap<>();
        evidence.put("taskId", complaint.getForwardedComplainId());
        evidence.put("workerName", complaint.getWorker() != null ? complaint.getWorker().getName() : null);
        evidence.put("remarks", complaint.getRemarks());
        evidence.put("submittedAt", complaint.getAssignedWorkerDate());

        // Evidence would come from forward_decision table
        // For now, return what we have

        return ApiResponse.ok(evidence);
    }

    // ========== RESPONDER CONFIRMS TASK COMPLETION (After viewing evidence) ==========

    @PutMapping("/tasks/{id}/confirm-complete")
    public ApiResponse<Void> confirmCompletion(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String username = requestContext.getResponderUsername();
        taskService.completeTask(username, id);
        return ApiResponse.okMessage("Task marked as COMPLETED. Citizen and Admin will see the updated status.");
    }

    // ========== GET TASK HISTORY (Completed/Rejected) ==========

    @GetMapping("/task-history")
    public ApiResponse<List<Map<String, Object>>> getTaskHistory() {
        String username = requestContext.getResponderUsername();

        List<ForwardedComplaint> complaints = taskService.getTasks(username);

        List<Map<String, Object>> history = complaints.stream()
                .filter(c -> c.getWorkerDecision() == Decision.D || c.getDeptDecision() == Decision.R)
                .map(this::toHistoryResponse)
                .collect(Collectors.toList());

        return ApiResponse.ok(history);
    }

    // ========== HELPER METHODS ==========

    private String getTaskStatus(ForwardedComplaint c) {
        if (c.getWorkerDecision() == Decision.D) return "COMPLETED";
        if (c.getDeptDecision() == Decision.R) return "REJECTED";
        if (c.getAssignedToWorker() != null && c.getAssignedToWorker()) return "WITH_VOLUNTEER";
        if (c.getDeptDecision() == Decision.D) return "ACCEPTED";
        return "PENDING";
    }

    private Map<String, Object> toTaskResponse(ForwardedComplaint c) {
        Map<String, Object> task = new HashMap<>();
        task.put("forwardedComplainId", c.getForwardedComplainId());
        task.put("id", c.getForwardedComplainId());
        task.put("reportId", c.getReportId());
        task.put("remarks", c.getRemarks());
        task.put("status", getTaskStatus(c));
        task.put("deptDecision", c.getDeptDecision() != null ? c.getDeptDecision().toString() : null);
        task.put("workerDecision", c.getWorkerDecision() != null ? c.getWorkerDecision().toString() : null);
        task.put("assignedToWorker", c.getAssignedToWorker());
        task.put("submitDate", c.getSubmitDate() != null ? c.getSubmitDate().toString() : null);
        task.put("acceptedByWorker", c.getAcceptedByWorker());

        // Department info
        if (c.getDepartment() != null) {
            Map<String, Object> dept = new HashMap<>();
            dept.put("deptId", c.getDepartment().getDeptId());
            dept.put("deptName", c.getDepartment().getDeptName());
            dept.put("deptAddress", c.getDepartment().getDeptAddress());
            task.put("department", dept);
        }

        // Citizen info
        if (c.getCitizen() != null) {
            Map<String, Object> citizen = new HashMap<>();
            citizen.put("id", c.getCitizen().getId());
            citizen.put("fname", c.getCitizen().getFullName());
            citizen.put("phoneNum", c.getCitizen().getPhoneNumber());
            task.put("citizen", citizen);
        }

        // Worker/Volunteer info
        if (c.getWorker() != null) {
            Map<String, Object> worker = new HashMap<>();
            worker.put("usernameCreated", c.getWorker().getUsernameCreated());
            worker.put("name", c.getWorker().getName());
            worker.put("phoneNumber", c.getWorker().getPhoneNumber());
            task.put("worker", worker);
            task.put("workerName", c.getWorker().getName());
        }

        return task;
    }

    private Map<String, Object> toHistoryResponse(ForwardedComplaint c) {
        Map<String, Object> task = toTaskResponse(c);
        task.put("decision", c.getWorkerDecision() == Decision.D ? "COMPLETED" : "REJECTED");
        task.put("completedAt", c.getAcceptedDate() != null ? c.getAcceptedDate().toString() :
                (c.getAssignedWorkerDate() != null ? c.getAssignedWorkerDate().toString() : null));
        return task;
    }
}