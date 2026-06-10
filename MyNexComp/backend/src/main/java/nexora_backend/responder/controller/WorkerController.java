package nexora_backend.responder.controller;

import nexora_backend.responder.dto.request.WorkerAddRequest;
import nexora_backend.responder.dto.response.WorkerResponse;
import nexora_backend.responder.service.WorkerService;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("responderModuleWorkerController")
@RequestMapping("/api/responder")
public class WorkerController {

    private final WorkerService workerService;
    private final RequestContext requestContext;

    public WorkerController(WorkerService workerService, RequestContext requestContext) {
        this.workerService = workerService;
        this.requestContext = requestContext;
    }

    @GetMapping("/workers")
    public ApiResponse<List<WorkerResponse>> getWorkers() {
        String username = requestContext.getResponderUsername();
        return ApiResponse.ok(workerService.getWorkers(username));
    }

    @PostMapping("/workers")
    public ApiResponse<WorkerResponse> addWorker(@RequestBody WorkerAddRequest request) {
        String username = requestContext.getResponderUsername();
        return ApiResponse.ok(workerService.addWorker(username, request));
    }

    @DeleteMapping("/workers/{username}")
    public ApiResponse<Void> removeWorker(@PathVariable String username) {
        String responderUsername = requestContext.getResponderUsername();
        workerService.removeWorker(responderUsername, username);
        return ApiResponse.okMessage("Worker removed successfully");
    }
}