package nexora_backend.assigningofficer.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nexora_backend.assigningofficer.dto.DepartmentRequest;
import nexora_backend.assigningofficer.service.AssigningOfficerService;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.database.entity.Department;
import nexora_backend.database.entity.ResponderType;
import nexora_backend.database.repository.ResponderTypeRepository;
import nexora_backend.shared.dto.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController("assigningOfficerDepartmentController")
@RequestMapping("/api/assigning-officer/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ASSIGNING_OFFICER')")
public class DepartmentController {

    private final AssigningOfficerService service;
    private final ResponderTypeRepository responderTypeRepository;

    /* =========================================
       LIST ALL DEPARTMENTS
    ========================================= */

    @GetMapping
    public ApiResponse<List<Department>> listAll() {
        return ApiResponse.ok(service.getAllDepartments());
    }

    /* =========================================
       LIST ACTIVE DEPARTMENTS (for dispatch dropdown)
    ========================================= */

    @GetMapping("/active")
    public ApiResponse<List<Department>> listActive() {
        return ApiResponse.ok(service.getActiveDepartments());
    }

    /* =========================================
       CREATE DEPARTMENT
    ========================================= */

    @PostMapping
    public ApiResponse<Department> create(
            @AuthenticationPrincipal AuthenticatedUser user,
            @Valid @RequestBody DepartmentRequest request
    ) {
        Department dept = service.createDepartment(user.getUsername(), request);
        return ApiResponse.ok("Department created successfully.", dept);
    }

    /* =========================================
       UPDATE DEPARTMENT
    ========================================= */

    @PutMapping("/{id}")
    public ApiResponse<Department> update(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request
    ) {
        Department dept = service.updateDepartment(id, request);
        return ApiResponse.ok("Department updated successfully.", dept);
    }

    /* =========================================
       DEACTIVATE DEPARTMENT
    ========================================= */

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deactivate(@PathVariable Long id) {
        service.deactivateDepartment(id);
        return ApiResponse.okMessage("Department deactivated successfully.");
    }

    /* =========================================
       LIST RESPONDER TYPES (for dropdown)
    ========================================= */

    @GetMapping("/responder-types")
    public ApiResponse<List<ResponderType>> responderTypes() {
        return ApiResponse.ok(responderTypeRepository.findAll());
    }
}
