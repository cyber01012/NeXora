
package nexora_backend.citizen.service;

import nexora_backend.citizen.dto.request.ProfileUpdateRequest;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.repository.RegisterCitizenRepository;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ProfileService {

    private final RegisterCitizenRepository citizenRepository;

    public ProfileService(RegisterCitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    public Map<String, Object> getProfile(Long citizenId) {
        RegisterCitizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));

        Map<String, Object> profile = new HashMap<>();
        profile.put("fullName", citizen.getFullName());
        profile.put("email", citizen.getEmail());
        profile.put("phone", citizen.getPhoneNumber());
        profile.put("cnic", citizen.getCnic());
        profile.put("address", citizen.getAddress());
        profile.put("city", citizen.getCity());

        return profile;
    }

    public void updateProfile(Long citizenId, ProfileUpdateRequest request) {
        RegisterCitizen citizen = citizenRepository.findById(citizenId)
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));

        if (request.getFullName() != null) citizen.setFullName(request.getFullName());
        if (request.getEmail() != null) citizen.setEmail(request.getEmail());
        if (request.getPhone() != null) citizen.setPhoneNumber(request.getPhone());
        if (request.getCnic() != null) citizen.setCnic(request.getCnic());
        if (request.getAddress() != null) citizen.setAddress(request.getAddress());
        if (request.getCity() != null) citizen.setCity(request.getCity());

        citizenRepository.save(citizen);
    }
}