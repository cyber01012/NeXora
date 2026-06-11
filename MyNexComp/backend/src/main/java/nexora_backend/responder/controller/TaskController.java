
package nexora_backend.responder.controller;

import io.jsonwebtoken.JwtBuilder;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.ForwardedComplaintRepository;
import nexora_backend.responder.service.TaskService;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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



    @GetMapping("/tasks")
    public ApiResponse<List<Map<String, Object>>> getTasks(@RequestParam(required = false) String status) {
        String username = requestContext.getResponderUsername();

        List<ForwardedComplaint> complaints;

        if ("PENDING".equalsIgnoreCase(status)) {
            complaints = taskService.getPendingTasks(username);
        } else if ("ACTIVE".equalsIgnoreCase(status)) {
            complaints = taskService.getActiveTasks(username);
        } else if ("HISTORY".equalsIgnoreCase(status)) {
            complaints = taskService.getHistoryTasks(username);
        } else {
            complaints = taskService.getAllTasks(username);
        }

        List<Map<String, Object>> tasks = complaints.stream()
                .map(this::toTaskResponse)
                .collect(Collectors.toList());

        return ApiResponse.ok(tasks);
    }

    @GetMapping("/tasks/{id}")
    public ApiResponse<Map<String, Object>> getTaskDetails(@PathVariable Long id) {
        ForwardedComplaint complaint = taskService.getTask(id);
        return ApiResponse.ok(toTaskResponse(complaint));
    }

    @PostMapping("/tasks/{id}/accept")
    public ApiResponse<Void> acceptTask(@PathVariable Long id) {
        String username = requestContext.getResponderUsername();
        taskService.acceptTask(username, id);
        return ApiResponse.okMessage("Task accepted successfully");
    }

    @PostMapping("/tasks/{id}/reject")
    public ApiResponse<Void> rejectTask(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String username = requestContext.getResponderUsername();
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "No reason provided";
        taskService.rejectTask(username, id, reason);
        return ApiResponse.okMessage("Task rejected");
    }

    @PutMapping("/tasks/{id}/assign-volunteer")
    public ApiResponse<Void> assignToVolunteer(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String username = requestContext.getResponderUsername();
        String volunteerUsername = body.get("volunteerUsername");

        if (volunteerUsername == null || volunteerUsername.isBlank()) {
            return ApiResponse.error("Volunteer username is required");
        }

        taskService.assignToVolunteer(username, id, volunteerUsername);
        return ApiResponse.okMessage("Task assigned to volunteer: " + volunteerUsername);
    }

    @PutMapping("/tasks/{id}/confirm-complete")
    public ApiResponse<Void> confirmCompletion(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String username = requestContext.getResponderUsername();
        String remarks = (body != null && body.containsKey("remarks")) ? body.get("remarks") : "Task completed";
        taskService.confirmCompletion(username, id, remarks);
        return ApiResponse.okMessage("Task marked as COMPLETED");
    }

    @GetMapping("/task-history")
    public ApiResponse<List<Map<String, Object>>> getTaskHistory() {
        String username = requestContext.getResponderUsername();
        List<ForwardedComplaint> history = taskService.getHistoryTasks(username);

        List<Map<String, Object>> result = history.stream()
                .map(this::toHistoryResponse)
                .collect(Collectors.toList());

        return ApiResponse.ok(result);
    }

    private String getTaskStatus(ForwardedComplaint c) {
        if (c.getWorkerDecision() == Decision.D) return "COMPLETED";
        if (c.getDeptDecision() == Decision.R) return "REJECTED";
        if (Boolean.TRUE.equals(c.getAssignedToWorker())) {
            if (Boolean.TRUE.equals(c.getAcceptedByWorker())) return "IN_PROGRESS";
            return "WITH_VOLUNTEER";
        }
        if (c.getDeptDecision() == Decision.D) return "ACCEPTED";
        return "PENDING";
    }

    private Map<String, Object> toTaskResponse(ForwardedComplaint c) {
        Map<String, Object> task = new HashMap<>();
        task.put("forwardedComplainId", c.getForwardedComplainId());
        task.put("id", c.getForwardedComplainId());
        task.put("reportId", c.getReportId());
        task.put("sosId", c.getSosId());
        task.put("remarks", c.getRemarks());
        task.put("status", getTaskStatus(c));
        task.put("deptDecision", c.getDeptDecision() != null ? c.getDeptDecision().toString() : null);
        task.put("workerDecision", c.getWorkerDecision() != null ? c.getWorkerDecision().toString() : null);
        task.put("anonymousId", c.getAnonymousId());
        task.put("assignedToWorker", c.getAssignedToWorker());
        task.put("submitDate", c.getSubmitDate() != null ? c.getSubmitDate().toString() : null);
        task.put("submitTime", c.getSubmitTime() != null ? c.getSubmitTime().toString() : null);
        task.put("acceptedByWorker", c.getAcceptedByWorker());

        if (c.getDepartment() != null) {
            Map<String, Object> dept = new HashMap<>();
            dept.put("deptId", c.getDepartment().getDeptId());
            dept.put("deptName", c.getDepartment().getDeptName());
            dept.put("deptAddress", c.getDepartment().getDeptAddress());
            task.put("department", dept);
        }

        if (c.getCitizen() != null) {
            Map<String, Object> citizen = new HashMap<>();
            citizen.put("id", c.getCitizen().getId());
            citizen.put("fullName", c.getCitizen().getFullName());
            citizen.put("phoneNumber", c.getCitizen().getPhoneNumber());
            task.put("citizen", citizen);
        }

        if (c.getAnonymousId() != null) {
            task.put("anonymousId", c.getAnonymousId());
            // Also fetch anonymous details if needed
            // task.put("anonymousPhone", c.getAnonymousReport().getPhone());
            // task.put("anonymousLocation", c.getAnonymousReport().getArea());
        }

        if (c.getWorker() != null) {
            Map<String, Object> worker = new HashMap<>();
            worker.put("usernameCreated", c.getWorker().getUsernameCreated());
            worker.put("name", c.getWorker().getName());
            worker.put("phoneNumber", c.getWorker().getPhoneNumber());
            task.put("worker", worker);
            task.put("workerName", c.getWorker().getName());
        }
        // Priority logic
        String priority = "MEDIUM";
        if (c.getSosId() != null) {
            priority = "HIGH";  // SOS always HIGH
        }
        task.put("priority", priority);

        if (c.getDeptUser() != null) {
            task.put("responderUsername", c.getDeptUser().getUsername());
            task.put("responderName", c.getDeptUser().getName());
        }




        return task;
    }

    private Map<String, Object> toHistoryResponse(ForwardedComplaint c) {
        Map<String, Object> task = toTaskResponse(c);
        task.put("finalDecision", c.getWorkerDecision() == Decision.D ? "COMPLETED" : "REJECTED");
        task.put("completedAt", c.getAcceptedDate() != null ? c.getAcceptedDate().toString() : null);
        task.put("completedTime", c.getAcceptedTime() != null ? c.getAcceptedTime().toString() : null);
        task.put("rejectedDate", c.getReadByDeptDate() != null && c.getDeptDecision() == Decision.R ? c.getReadByDeptDate().toString() : null);
        return task;
    }
}