// ============================================
// FILE: nexora_backend/citizen/controller/ReportController.java
// ============================================
package nexora_backend.citizen.controller;

import jakarta.validation.Valid;
import nexora_backend.citizen.dto.request.ReportRequest;
import nexora_backend.database.entity.CivicReport;
import nexora_backend.citizen.service.ReportService;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
public class ReportController {

    private final ReportService reportService;
    private final RequestContext requestContext;

    public ReportController(ReportService reportService,
                            RequestContext requestContext) {
        this.reportService = reportService;
        this.requestContext = requestContext;
    }

    @PostMapping("/reports")
    public ApiResponse<CivicReport> createReport(@Valid @RequestBody ReportRequest request) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        CivicReport report = reportService.createReport(citizenId, request);
        return ApiResponse.ok("Report submitted successfully", report);
    }

    @GetMapping("/my-reports")
    public ApiResponse<List<CivicReport>> myReports(@RequestParam(required = false) String status) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        return ApiResponse.ok(reportService.getMyReports(citizenId, status));
    }

    @GetMapping("/stats")
    public ApiResponse<Object> stats() {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        return ApiResponse.ok(reportService.getStats(citizenId));
    }
}