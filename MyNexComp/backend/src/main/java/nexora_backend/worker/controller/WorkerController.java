package nexora_backend.worker.controller;

// import nexora_backend.shared.entity.HelpDeskMessage;
// import nexora_backend.shared.repository.HelpDeskMessageRepository;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import nexora_backend.worker.dto.request.WorkerTaskActionRequest;
import nexora_backend.worker.dto.response.*;
import nexora_backend.worker.service.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Worker Portal REST Controller
 *
 * All endpoints are under /api/worker.
 * Authentication: reads worker username from X-Worker-Username header via RequestContext.
 *
 * Covers: Dashboard, Tasks, Task History, Profile, Performance, Help Desk.
 */
@RestController("volunteerWorkerController")
@RequestMapping("/api/worker")
public class WorkerController {

    private final WorkerDashboardService dashboardService;
    private final WorkerTaskService taskService;
    private final WorkerProfileService profileService;
    private final WorkerPerformanceService performanceService;
    // private final HelpDeskMessageRepository helpDeskRepository;
    private final RequestContext requestContext;

    public WorkerController(WorkerDashboardService dashboardService,
                            WorkerTaskService taskService,
                            WorkerProfileService profileService,
                            WorkerPerformanceService performanceService,
                            // HelpDeskMessageRepository helpDeskRepository,
                            RequestContext requestContext) {
        this.dashboardService   = dashboardService;
        this.taskService        = taskService;
        this.profileService     = profileService;
        this.performanceService = performanceService;
        // this.helpDeskRepository = helpDeskRepository;
        this.requestContext     = requestContext;
    }

    // ========== DASHBOARD ==========

    @GetMapping("/dashboard")
    public ApiResponse<WorkerDashboardResponse> getDashboard(
            @RequestParam(required = false) String workerUsername) {
        String username = resolveUsername(workerUsername);
        return ApiResponse.ok(dashboardService.getDashboard(username));
    }

    // ========== TASKS ==========

    /**
     * GET /api/worker/tasks — returns tasks assigned to this worker.
     * Optional ?status= filter: PENDING_ACCEPTANCE | IN_PROGRESS | ALL
     * Also accessible as /nearby for frontend compatibility.
     */
    @GetMapping({"/tasks", "/tasks/nearby"})
    public ApiResponse<List<WorkerTaskResponse>> getTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String workerUsername) {
        String username = resolveUsername(workerUsername);

        List<WorkerTaskResponse> tasks;
        if ("PENDING_ACCEPTANCE".equalsIgnoreCase(status)) {
            tasks = taskService.getPendingTasks(username);
        } else if ("IN_PROGRESS".equalsIgnoreCase(status)) {
            tasks = taskService.getActiveTasks(username);
        } else {
            tasks = taskService.getAssignedTasks(username);
        }

        return ApiResponse.ok(tasks);
    }

    @GetMapping("/tasks/{id}")
    public ApiResponse<WorkerTaskResponse> getTask(
            @PathVariable Long id,
            @RequestParam(required = false) String workerUsername) {
        String username = resolveUsername(workerUsername);
        return ApiResponse.ok(taskService.getTask(username, id));
    }

    /** Worker accepts a task assigned to them. */
    @PostMapping("/tasks/{id}/accept")
    public ApiResponse<WorkerTaskResponse> acceptTask(
            @PathVariable Long id,
            @RequestParam(required = false) String workerUsername) {
        String username = resolveUsername(workerUsername);
        WorkerTaskResponse result = taskService.acceptTask(username, id);
        return ApiResponse.ok("Task accepted successfully", result);
    }

    /** Worker declines/rejects a task. */
    @PostMapping("/tasks/{id}/reject")
    public ApiResponse<WorkerTaskResponse> rejectTask(
            @PathVariable Long id,
            @RequestParam(required = false) String workerUsername,
            @RequestBody(required = false) WorkerTaskActionRequest body) {
        String username = resolveUsername(workerUsername);
        String reason   = (body != null && body.getReason() != null) ? body.getReason() : "No reason provided";
        WorkerTaskResponse result = taskService.rejectTask(username, id, reason);
        return ApiResponse.ok("Task rejected", result);
    }

    /** Worker marks a task complete. */
    @PostMapping("/tasks/{id}/complete")
    public ApiResponse<WorkerTaskResponse> completeTask(
            @PathVariable Long id,
            @RequestParam(required = false) String workerUsername,
            @RequestBody(required = false) WorkerTaskActionRequest body) {
        String username = resolveUsername(workerUsername);
        String remarks  = (body != null && body.getRemarks() != null) ? body.getRemarks() : "Task completed";
        WorkerTaskResponse result = taskService.completeTask(username, id, remarks);
        return ApiResponse.ok("Task marked as COMPLETED", result);
    }

    /** Worker updates progress (start work / progress note). */
    @PostMapping("/tasks/{id}/progress")
    public ApiResponse<WorkerTaskResponse> updateProgress(
            @PathVariable Long id,
            @RequestParam(required = false) String workerUsername,
            @RequestBody(required = false) WorkerTaskActionRequest body) {
        String username = resolveUsername(workerUsername);
        String notes    = (body != null && body.getNotes() != null) ? body.getNotes() : null;
        WorkerTaskResponse result = taskService.startProgress(username, id, notes);
        return ApiResponse.ok("Progress updated", result);
    }

    /** Worker requests help for a task. */
    @PostMapping("/tasks/{id}/help")
    public ApiResponse<Void> requestHelp(
            @PathVariable Long id,
            @RequestParam(required = false) String workerUsername,
            @RequestParam(required = false) String reason,
            @RequestBody(required = false) WorkerTaskActionRequest body) {
        String username     = resolveUsername(workerUsername);
        String helpReason   = reason != null ? reason
                : (body != null && body.getReason() != null ? body.getReason() : "Assistance needed");
        taskService.requestHelp(username, id, helpReason);
        return ApiResponse.okMessage("Help request submitted");
    }

    // ========== TASK HISTORY ==========

    @GetMapping("/task-history")
    public ApiResponse<List<WorkerHistoryResponse>> getTaskHistory(
            @RequestParam(required = false) String workerUsername) {
        String username = resolveUsername(workerUsername);
        return ApiResponse.ok(taskService.getTaskHistory(username));
    }

    // ========== PROFILE ==========

    @GetMapping("/profile")
    public ApiResponse<WorkerProfileResponse> getProfile(
            @RequestParam(required = false) String workerUsername) {
        String username = resolveUsername(workerUsername);
        return ApiResponse.ok(profileService.getProfile(username));
    }

    @PutMapping("/profile")
    public ApiResponse<WorkerProfileResponse> updateProfile(
            @RequestParam(required = false) String workerUsername,
            @RequestBody Map<String, Object> updates) {
        String username = resolveUsername(workerUsername);
        WorkerProfileResponse updated = profileService.updateProfile(username, updates);
        return ApiResponse.ok("Profile updated successfully", updated);
    }

    // ========== PERFORMANCE ==========

    @GetMapping("/performance")
    public ApiResponse<WorkerPerformanceResponse> getPerformance(
            @RequestParam(required = false) String workerUsername) {
        String username = resolveUsername(workerUsername);
        return ApiResponse.ok(performanceService.getPerformance(username));
    }

    // ========== HELP DESK ==========

    // @GetMapping("/helpdesk")
    // public ApiResponse<List<Map<String, Object>>> getHelpMessages(
    //         @RequestParam(required = false) String workerUsername) {
    //     String username = resolveUsername(workerUsername);
    //
    //     List<HelpDeskMessage> messages = helpDeskRepository.findBySenderUsernameOrReceiverUsernameOrderByCreatedAtAsc(username, username);
    //
    //     List<Map<String, Object>> result = messages.stream().map(m -> {
    //         Map<String, Object> msg = new java.util.HashMap<>();
    //         msg.put("id",               m.getId());
    //         msg.put("senderUsername",   m.getSenderUsername());
    //         msg.put("receiverUsername", m.getReceiverUsername());
    //         msg.put("message",          m.getMessage());
    //         msg.put("isRead",           m.getIsRead());
    //         msg.put("createdAt",        m.getCreatedAt() != null ? m.getCreatedAt().toString() : null);
    //         msg.put("isMine",           username.equals(m.getSenderUsername()));
    //         return msg;
    //     }).collect(Collectors.toList());
    //
    //     return ApiResponse.ok(result);
    // }
    //
    // @PostMapping("/helpdesk")
    // public ApiResponse<Void> sendHelpMessage(
    //         @RequestParam(required = false) String workerUsername,
    //         @RequestBody Map<String, String> body) {
    //     String username = resolveUsername(workerUsername);
    //     String message  = body != null ? body.get("message") : null;
    //
    //     if (message == null || message.isBlank()) {
    //         return ApiResponse.error("Message cannot be empty");
    //     }
    //
    //     HelpDeskMessage msg = HelpDeskMessage.builder()
    //             .senderUsername(username)
    //             .receiverUsername("SUPPORT")
    //             .message(message)
    //             .isRead(false)
    //             .build();
    //
    //     helpDeskRepository.save(msg);
    //     return ApiResponse.okMessage("Message sent");
    // }

    // ========== PRIVATE HELPERS ==========

    /**
     * Resolves worker username: request param → X-Worker-Username header → default.
     * Query param support allows testing via Postman without headers.
     */
    private String resolveUsername(String requestParamUsername) {
        if (requestParamUsername != null && !requestParamUsername.isBlank()) {
            return requestParamUsername;
        }
        return requestContext.getWorkerUsername();
    }
}
