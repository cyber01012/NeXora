
package nexora_backend.citizen.controller;

import jakarta.validation.Valid;
import nexora_backend.citizen.dto.request.SavedLocationRequest;
import nexora_backend.citizen.dto.response.SavedLocationResponse;
import nexora_backend.citizen.service.SavedLocationService;
import nexora_backend.shared.dto.ApiResponse;
import nexora_backend.shared.util.RequestContext;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
public class SavedLocationController {

    private final SavedLocationService savedLocationService;
    private final RequestContext requestContext;

    public SavedLocationController(SavedLocationService savedLocationService, RequestContext requestContext) {
        this.savedLocationService = savedLocationService;
        this.requestContext = requestContext;
    }

    @GetMapping("/saved-locations")
    public ApiResponse<List<SavedLocationResponse>> getSavedLocations() {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        return ApiResponse.ok(savedLocationService.list(citizenId));
    }

    @PostMapping("/saved-locations")
    public ApiResponse<SavedLocationResponse> addSavedLocation(@Valid @RequestBody SavedLocationRequest request) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        return ApiResponse.ok(savedLocationService.create(citizenId, request));
    }

    @PutMapping("/saved-locations/{id}")
    public ApiResponse<SavedLocationResponse> updateSavedLocation(@PathVariable Long id, @Valid @RequestBody SavedLocationRequest request) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        return ApiResponse.ok(savedLocationService.update(citizenId, id, request));
    }

    @PutMapping("/saved-locations/{id}/default")
    public ApiResponse<Void> setDefaultLocation(@PathVariable Long id) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        savedLocationService.setDefault(citizenId, id);
        return ApiResponse.okMessage("Default location updated");
    }

    @DeleteMapping("/saved-locations/{id}")
    public ApiResponse<Void> deleteSavedLocation(@PathVariable Long id) {
        Long citizenId = requestContext.getCitizenIdOrDefault(1L);
        savedLocationService.delete(citizenId, id);
        return ApiResponse.okMessage("Location deleted");
    }
}