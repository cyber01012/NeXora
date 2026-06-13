package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.auth.util.PhoneValidator;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.RegisterCitizenRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
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
                .orElseThrow(AuthErrors::loginAccountNotFound);
    }

    public AuthenticatedUser findByEmail(String email) {
        return registerCitizenRepository.findByEmailIgnoreCase(email)
                .map(this::toAuthenticatedUser)
                .or(() -> adminUserRepository.findByEmailIgnoreCase(email).map(this::toAuthenticatedUser))
                .or(() -> volunteerWorkerCreatorRepository.findByEmailIgnoreCase(email).map(this::toAuthenticatedUser))
                .orElseThrow(AuthErrors::emailNotFound);
    }

    public AuthenticatedUser findBySource(UserSource source, String sourceId) {
        return switch (source) {
            case CITIZEN -> registerCitizenRepository.findById(Long.parseLong(sourceId))
                    .map(this::toAuthenticatedUser)
                    .orElseThrow(AuthErrors::citizenNotFound);
            case ADMIN_USER -> adminUserRepository.findById(sourceId)
                    .map(this::toAuthenticatedUser)
                    .orElseThrow(AuthErrors::adminUserNotFound);
            case VOLUNTEER_WORKER -> volunteerWorkerCreatorRepository.findById(sourceId)
                    .map(this::toAuthenticatedUser)
                    .orElseThrow(AuthErrors::volunteerWorkerNotFound);
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
        return lookupCitizenByPhone(identifier).map(this::toAuthenticatedUser);
    }

    private java.util.Optional<RegisterCitizen> lookupCitizenByPhone(String identifier) {
        if (PhoneValidator.isValidFormat(identifier)) {
            return registerCitizenRepository.findByPhoneNumber(
                    encryptionService.encryptDeterministic(PhoneValidator.normalize(identifier)));
        }
        return registerCitizenRepository.findByPhoneNumber(
                encryptionService.encryptDeterministic(identifier));
    }

    private java.util.Optional<AuthenticatedUser> findAdminUser(String identifier) {
        return adminUserRepository.findById(identifier)
                .or(() -> adminUserRepository.findByEmailIgnoreCase(identifier))
                .or(() -> lookupAdminByContact(identifier))
                .map(this::toAuthenticatedUser);
    }

    private java.util.Optional<AdminUser> lookupAdminByContact(String identifier) {
        if (PhoneValidator.isValidFormat(identifier)) {
            return adminUserRepository.findByContactNumber(
                    encryptionService.encryptDeterministic(PhoneValidator.normalize(identifier)));
        }
        return adminUserRepository.findByContactNumber(
                encryptionService.encryptDeterministic(identifier));
    }

    private java.util.Optional<AuthenticatedUser> findVolunteerWorker(String identifier) {
        return volunteerWorkerCreatorRepository.findById(identifier)
                .or(() -> volunteerWorkerCreatorRepository.findByEmailIgnoreCase(identifier))
                .or(() -> lookupVolunteerWorkerByPhone(identifier))
                .map(this::toAuthenticatedUser);
    }

    private java.util.Optional<VolunteerWorkerCreator> lookupVolunteerWorkerByPhone(String identifier) {
        if (PhoneValidator.isValidFormat(identifier)) {
            return volunteerWorkerCreatorRepository.findByPhoneNumber(
                    encryptionService.encryptDeterministic(PhoneValidator.normalize(identifier)));
        }
        return volunteerWorkerCreatorRepository.findByPhoneNumber(
                encryptionService.encryptDeterministic(identifier));
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
        // Gracefully handle workers that were inserted directly into the DB without a user_type_id.
        // We infer the role: usernames prefixed with "vol_" are VOLUNTEER, everything else is WORKER.
        // The permanent fix is to run:
        //   UPDATE volunteer_worker SET user_type_id = 7 WHERE user_type_id IS NULL;
        //   UPDATE volunteer_worker SET user_type_id = 6 WHERE user_type_id IS NULL AND username_created LIKE 'vol_%';
        SystemRole role;
        if (worker.getUserType() == null || worker.getUserType().getName() == null) {
            // Fallback: infer from username convention, default to WORKER
            String username = worker.getUsernameCreated();
            role = (username != null && username.toLowerCase().startsWith("vol_"))
                    ? SystemRole.VOLUNTEER
                    : SystemRole.WORKER;
        } else {
            role = SystemRole.fromUserTypeName(worker.getUserType().getName());
        }
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
