package nexora_backend.responder.service;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.responder.dto.request.AvailabilityRequest;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AvailabilityService {

    private final AdminUserRepository adminUserRepository;

    public AvailabilityService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Transactional
    public void setAvailability(String username, AvailabilityRequest request) {
        AdminUser user = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));

        user.setActive(request.isAvailable());
        adminUserRepository.save(user);
    }
}