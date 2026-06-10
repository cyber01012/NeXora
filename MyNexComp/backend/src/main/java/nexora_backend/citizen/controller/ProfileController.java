
package nexora_backend.citizen.controller;

import nexora_backend.citizen.dto.request.ProfileUpdateRequest;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.repository.RegisterCitizenRepository;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/citizen")
public class ProfileController {

    private final RequestContext requestContext;
    private final RegisterCitizenRepository citizenRepository;

    public ProfileController(RequestContext requestContext,
                             RegisterCitizenRepository citizenRepository) {
        this.requestContext = requestContext;
        this.citizenRepository = citizenRepository;
    }

    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> getProfile() {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        RegisterCitizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new HashMap<>();
        profile.put("fullName", citizen.getFullName());
        profile.put("email", citizen.getEmail());
        profile.put("phone", citizen.getPhoneNumber());
        profile.put("cnic", citizen.getCnic());
        profile.put("address", citizen.getAddress());
        profile.put("city", citizen.getCity());

        return ApiResponse.ok(profile);
    }

    @PutMapping("/profile")
    public ApiResponse<Void> updateProfile(@RequestBody ProfileUpdateRequest request) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        RegisterCitizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null) citizen.setFullName(request.getFullName());
        if (request.getEmail() != null) citizen.setEmail(request.getEmail());
        if (request.getPhone() != null) citizen.setPhoneNumber(request.getPhone());
        if (request.getCnic() != null) citizen.setCnic(request.getCnic());
        if (request.getAddress() != null) citizen.setAddress(request.getAddress());
        if (request.getCity() != null) citizen.setCity(request.getCity());

        citizenRepository.save(citizen);
        return ApiResponse.okMessage("Profile updated successfully");
    }
}