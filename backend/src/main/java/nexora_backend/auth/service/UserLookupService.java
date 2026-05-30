package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.exception.AuthException;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.RegisterCitizenRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserLookupService {

    private final RegisterCitizenRepository registerCitizenRepository;
    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerWorkerCreatorRepository;
    private final EncryptionService encryptionService;

    public AuthenticatedUser findByIdentifier(String identifier) {
        return findCitizen(identifier)
                .or(() -> findAdminUser(identifier))
                .or(() -> findVolunteerWorker(identifier))
                .orElseThrow(() -> new AuthException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    }

    public AuthenticatedUser findByEmail(String email) {
        return registerCitizenRepository.findByEmailIgnoreCase(email)
                .map(this::toAuthenticatedUser)
                .or(() -> adminUserRepository.findByEmailIgnoreCase(email).map(this::toAuthenticatedUser))
                .or(() -> volunteerWorkerCreatorRepository.findByEmailIgnoreCase(email).map(this::toAuthenticatedUser))
                .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "No account found for this email"));
    }

    public AuthenticatedUser findBySource(UserSource source, String sourceId) {
        return switch (source) {
            case CITIZEN -> registerCitizenRepository.findById(Long.parseLong(sourceId))
                    .map(this::toAuthenticatedUser)
                    .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Citizen not found"));
            case ADMIN_USER -> adminUserRepository.findById(sourceId)
                    .map(this::toAuthenticatedUser)
                    .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Admin user not found"));
            case VOLUNTEER_WORKER -> volunteerWorkerCreatorRepository.findById(sourceId)
                    .map(this::toAuthenticatedUser)
                    .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "Volunteer/Worker not found"));
        };
    }

    public void updatePassword(UserSource source, String sourceId, String encodedPassword) {
        switch (source) {
            case CITIZEN -> registerCitizenRepository.findById(Long.parseLong(sourceId)).ifPresent(citizen -> {
                citizen.setPassword(encodedPassword);
                registerCitizenRepository.save(citizen);
            });
            case ADMIN_USER -> adminUserRepository.findById(sourceId).ifPresent(admin -> {
                admin.setPassword(encodedPassword);
                adminUserRepository.save(admin);
            });
            case VOLUNTEER_WORKER -> volunteerWorkerCreatorRepository.findById(sourceId).ifPresent(worker -> {
                worker.setPassword(encodedPassword);
                volunteerWorkerCreatorRepository.save(worker);
            });
        }
    }

    private java.util.Optional<AuthenticatedUser> findCitizen(String identifier) {
        java.util.Optional<RegisterCitizen> byEmail = registerCitizenRepository.findByEmailIgnoreCase(identifier);
        if (byEmail.isPresent()) {
            return byEmail.map(this::toAuthenticatedUser);
        }
        String encryptedPhone = encryptionService.encrypt(identifier);
        return registerCitizenRepository.findByPhoneNumber(encryptedPhone).map(this::toAuthenticatedUser);
    }

    private java.util.Optional<AuthenticatedUser> findAdminUser(String identifier) {
        return adminUserRepository.findById(identifier)
                .or(() -> adminUserRepository.findByEmailIgnoreCase(identifier))
                .or(() -> adminUserRepository.findByContactNumber(encryptionService.encrypt(identifier)))
                .map(this::toAuthenticatedUser);
    }

    private java.util.Optional<AuthenticatedUser> findVolunteerWorker(String identifier) {
        return volunteerWorkerCreatorRepository.findById(identifier)
                .or(() -> volunteerWorkerCreatorRepository.findByEmailIgnoreCase(identifier))
                .or(() -> volunteerWorkerCreatorRepository.findByPhoneNumber(encryptionService.encrypt(identifier)))
                .map(this::toAuthenticatedUser);
    }

    public AuthenticatedUser toAuthenticatedUser(RegisterCitizen citizen) {
        return AuthenticatedUser.builder()
                .identifier(resolveCitizenIdentifier(citizen))
                .passwordHash(citizen.getPassword())
                .role(SystemRole.CITIZEN)
                .source(UserSource.CITIZEN)
                .sourceId(String.valueOf(citizen.getId()))
                .active(true)
                .email(citizen.getEmail())
                .displayName(citizen.getFullName())
                .build();
    }

    public AuthenticatedUser toAuthenticatedUser(AdminUser adminUser) {
        SystemRole role = SystemRole.fromUserTypeName(adminUser.getUserType().getName());
        return AuthenticatedUser.builder()
                .identifier(adminUser.getUsername())
                .passwordHash(adminUser.getPassword())
                .role(role)
                .source(UserSource.ADMIN_USER)
                .sourceId(adminUser.getUsername())
                .active(adminUser.getActive() == null || adminUser.getActive())
                .email(adminUser.getEmail())
                .displayName(adminUser.getName())
                .build();
    }

    public AuthenticatedUser toAuthenticatedUser(VolunteerWorkerCreator worker) {
        if (worker.getUserType() == null || worker.getUserType().getName() == null) {
            throw new AuthException(HttpStatus.INTERNAL_SERVER_ERROR, "Volunteer/Worker user type is missing");
        }
        SystemRole role = SystemRole.fromUserTypeName(worker.getUserType().getName());
        return AuthenticatedUser.builder()
                .identifier(worker.getUsernameCreated())
                .passwordHash(worker.getPassword())
                .role(role)
                .source(UserSource.VOLUNTEER_WORKER)
                .sourceId(worker.getUsernameCreated())
                .active(worker.getActive() == null || worker.getActive())
                .email(worker.getEmail())
                .displayName(worker.getName())
                .build();
    }

    private String resolveCitizenIdentifier(RegisterCitizen citizen) {
        if (citizen.getEmail() != null && !citizen.getEmail().isBlank()) {
            return citizen.getEmail();
        }
        return encryptionService.decrypt(citizen.getPhoneNumber());
    }
}
