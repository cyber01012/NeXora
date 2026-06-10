package nexora_backend.assigningofficer.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nexora_backend.assigningofficer.dto.DispatchRequest;
import nexora_backend.assigningofficer.service.AssigningOfficerService;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.shared.dto.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assigning-officer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASSIGNING_OFFICER')")
public class AssigningOfficerController {

    private final AssigningOfficerService service;

    /* =========================================
       DASHBOARD
    ========================================= */

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> dashboard(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ApiResponse.ok(service.getDashboard(user.getUsername()));
    }

    /* =========================================
       PENDING REPORTS (SOS + CIVIC)
    ========================================= */

    @GetMapping("/pending-reports")
    public ApiResponse<List<Map<String, Object>>> pendingReports() {
        return ApiResponse.ok(service.getPendingReports());
    }

    /* =========================================
       DISPATCH (Forward to Department)
    ========================================= */

    @PostMapping("/dispatch")
    public ApiResponse<Map<String, Object>> dispatch(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody DispatchRequest request
    ) {
        return ApiResponse.ok(
                "Report dispatched successfully.",
                service.dispatch(user.getUsername(), request)
        );
    }

    /* =========================================
       FORWARDED TRACKER
    ========================================= */

    @GetMapping("/forwarded")
    public ApiResponse<List<Map<String, Object>>> forwarded(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ApiResponse.ok(service.getForwardedComplaints(user.getUsername()));
    }

    /* =========================================
       HISTORY (Completed + Rejected)
    ========================================= */

    @GetMapping("/history")
    public ApiResponse<List<Map<String, Object>>> history(
            @AuthenticationPrincipal AuthenticatedUser user
    ) {
        return ApiResponse.ok(service.getHistory(user.getUsername()));
    }
}
