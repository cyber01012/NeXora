
package nexora_backend.citizen.service;

import nexora_backend.citizen.dto.request.SavedLocationRequest;
import nexora_backend.citizen.dto.response.SavedLocationResponse;
import nexora_backend.independent.entity.CitizenSavedLocation;
import nexora_backend.citizen.repository.CitizenSavedLocationRepository;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedLocationService {

    private final CitizenSavedLocationRepository locationRepository;

    public SavedLocationService(CitizenSavedLocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<SavedLocationResponse> list(Long citizenId) {
        return locationRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public SavedLocationResponse create(Long citizenId, SavedLocationRequest request) {
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            locationRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                    .forEach(loc -> { loc.setIsDefault(false); locationRepository.save(loc); });
        }

        CitizenSavedLocation locToSave = new CitizenSavedLocation();
        locToSave.setCitizenId(citizenId);
        locToSave.setLabel(request.getLabel());
        locToSave.setAddress(request.getAddress());
        locToSave.setLatitude(request.getLatitude());
        locToSave.setLongitude(request.getLongitude());
        locToSave.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);

        CitizenSavedLocation saved = locationRepository.save(locToSave);
        return toResponse(saved);
    }

    @Transactional
    public SavedLocationResponse update(Long citizenId, Long id, SavedLocationRequest request) {
        CitizenSavedLocation location = locationRepository.findByIdAndCitizenId(id, citizenId)
                .orElseThrow(() -> new BusinessException("Location not found", HttpStatus.NOT_FOUND));

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            locationRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                    .forEach(loc -> { loc.setIsDefault(false); locationRepository.save(loc); });
        }

        location.setLabel(request.getLabel());
        location.setAddress(request.getAddress());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);

        CitizenSavedLocation updated = locationRepository.save(location);
        return toResponse(updated);
    }

    @Transactional
    public void setDefault(Long citizenId, Long id) {
        locationRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
                .forEach(loc -> { loc.setIsDefault(false); locationRepository.save(loc); });

        CitizenSavedLocation location = locationRepository.findByIdAndCitizenId(id, citizenId)
                .orElseThrow(() -> new BusinessException("Location not found", HttpStatus.NOT_FOUND));
        location.setIsDefault(true);
        locationRepository.save(location);
    }

    @Transactional
    public void delete(Long citizenId, Long id) {
        CitizenSavedLocation loc = locationRepository.findByIdAndCitizenId(id, citizenId)
                .orElseThrow(() -> new BusinessException("Location not found", HttpStatus.NOT_FOUND));
        locationRepository.delete(loc);
    }

    private SavedLocationResponse toResponse(CitizenSavedLocation loc) {
        return SavedLocationResponse.builder()
                .id(loc.getId())
                .label(loc.getLabel())
                .address(loc.getAddress())
                .latitude(loc.getLatitude())
                .longitude(loc.getLongitude())
                .isDefault(loc.getIsDefault())
                .createdAt(loc.getCreatedAt())
                .build();
    }
}