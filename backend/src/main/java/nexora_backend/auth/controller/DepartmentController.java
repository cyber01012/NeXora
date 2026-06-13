package nexora_backend.auth.controller;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.DepartmentResponse;
import nexora_backend.database.entity.Department;
import nexora_backend.database.repository.DepartmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> listDepartments() {
        List<DepartmentResponse> departments = departmentRepository.findAll().stream()
                .filter(dept -> dept.getActive() == null || Boolean.TRUE.equals(dept.getActive()))
                .sorted(Comparator.comparing(Department::getDeptName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .map(dept -> DepartmentResponse.builder()
                        .id(dept.getDeptId())
                        .name(dept.getDeptName())
                        .responderTypeCategory(dept.getResponderTypeCategory())
                        .responderTypeName(dept.getResponderType() == null ? null : dept.getResponderType().getName())
                        .build())
                .toList();
        return ResponseEntity.ok(departments);
    }
}
