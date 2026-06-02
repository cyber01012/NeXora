package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.UserSource;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.RegisterCitizenRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final RegisterCitizenRepository registerCitizenRepository;
    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerWorkerCreatorRepository;

    public boolean isEmailVerified(UserSource source, String sourceId) {
        return switch (source) {
            case CITIZEN -> registerCitizenRepository.findById(Long.parseLong(sourceId))
                    .map(c -> Boolean.TRUE.equals(c.getEmailVerified()))
                    .orElse(false);
            case ADMIN_USER -> adminUserRepository.findById(sourceId)
                    .map(a -> Boolean.TRUE.equals(a.getEmailVerified()))
                    .orElse(false);
            case VOLUNTEER_WORKER -> volunteerWorkerCreatorRepository.findById(sourceId)
                    .map(v -> Boolean.TRUE.equals(v.getEmailVerified()))
                    .orElse(false);
        };
    }

    @Transactional
    public void markEmailVerified(UserSource source, String sourceId) {
        switch (source) {
            case CITIZEN -> registerCitizenRepository.findById(Long.parseLong(sourceId)).ifPresent(citizen -> {
                citizen.setEmailVerified(true);
                registerCitizenRepository.save(citizen);
            });
            case ADMIN_USER -> adminUserRepository.findById(sourceId).ifPresent(admin -> {
                admin.setEmailVerified(true);
                adminUserRepository.save(admin);
            });
            case VOLUNTEER_WORKER -> volunteerWorkerCreatorRepository.findById(sourceId).ifPresent(worker -> {
                worker.setEmailVerified(true);
                volunteerWorkerCreatorRepository.save(worker);
            });
            default -> throw AuthErrors.unsupportedUserSource();
        };
    }

    public void requireEmailVerifiedForLogin(UserSource source, String sourceId, nexora_backend.auth.model.SystemRole role) {
        // Email verification is no longer required for login for any role
    }
}
