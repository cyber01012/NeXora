package nexora_backend.responder.controller;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.Department;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.responder.dto.request.AvailabilityRequest;
import nexora_backend.responder.dto.response.PerformanceResponse;
import nexora_backend.responder.service.AvailabilityService;
import nexora_backend.responder.service.PerformanceService;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/responder")
public class ResponderController {

    private final PerformanceService performanceService;
    private final AvailabilityService availabilityService;
    private final RequestContext requestContext;
    private final AdminUserRepository adminUserRepository;

    public ResponderController(PerformanceService performanceService,
                               AvailabilityService availabilityService,
                               RequestContext requestContext,
                               AdminUserRepository adminUserRepository) {
        this.performanceService = performanceService;
        this.availabilityService = availabilityService;
        this.requestContext = requestContext;
        this.adminUserRepository = adminUserRepository;
    }

    @GetMapping("/performance")
    public ApiResponse<PerformanceResponse> getPerformance() {
        String username = requestContext.getResponderUsername();
        return ApiResponse.ok(performanceService.getPerformance(username));
    }

    @PutMapping("/availability")
    public ApiResponse<Void> updateAvailability(@RequestBody AvailabilityRequest request) {
        String username = requestContext.getResponderUsername();
        availabilityService.setAvailability(username, request);
        return ApiResponse.okMessage(request.isAvailable() ? "You are now ONLINE" : "You are now OFFLINE");
    }

    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> getProfile() {
        String username = requestContext.getResponderUsername();

        AdminUser user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Map<String, Object> profile = new HashMap<>();
        profile.put("username", user.getUsername());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("phoneNumber", user.getContactNumber());
        profile.put("category", user.getCategory());
        profile.put("active", user.getActive());

        Department department = user.getDepartment();
        if (department != null) {
            profile.put("department", department.getDeptName());
            profile.put("deptAddress", department.getDeptAddress());
            profile.put("deptId", department.getDeptId());
        } else {
            profile.put("department", "Not Assigned");
            profile.put("deptAddress", "");
        }

        profile.put("designation", "Focal Person");
        profile.put("memberSince", user.getDate() != null ? user.getDate().toString() : "2024-01-01");

        return ApiResponse.ok(profile);
    }

    @PutMapping("/profile")
    public ApiResponse<Void> updateProfile(@RequestBody Map<String, Object> updates) {
        String username = requestContext.getResponderUsername();

        AdminUser user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("phoneNumber")) {
            user.setContactNumber((String) updates.get("phoneNumber"));
        }

        adminUserRepository.save(user);
        return ApiResponse.okMessage("Profile updated successfully");
    }
}