package nexora_backend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.RegisterCitizenRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;

/**
 * Re-encrypts phone/CNIC/contact fields that were stored with random IVs so login lookups work.
 * Skips values that would violate unique constraints (e.g. duplicate plaintext CNICs in legacy data).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LookupFieldEncryptionMigrator {

    private final EncryptionService encryptionService;
    private final RegisterCitizenRepository registerCitizenRepository;
    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerWorkerCreatorRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void migrateLookupFields() {
        int citizens = migrateCitizens();
        int admins = migrateAdmins();
        int workers = migrateVolunteers();
        if (citizens + admins + workers > 0) {
            log.info(
                    "Migrated lookup encryption for {} citizen(s), {} admin(s), {} volunteer/worker(s).",
                    citizens,
                    admins,
                    workers
            );
        }
    }

    private int migrateCitizens() {
        int count = 0;
        for (RegisterCitizen citizen : registerCitizenRepository.findAll()) {
            boolean changed = false;

            String phone = toDeterministic(citizen.getPhoneNumber());
            if (phone != null && !registerCitizenRepository.existsByPhoneNumberAndIdNot(phone, citizen.getId())) {
                citizen.setPhoneNumber(phone);
                changed = true;
            } else if (phone != null) {
                log.warn(
                        "Skipping phone migration for citizen id={}: deterministic value already used by another account.",
                        citizen.getId()
                );
            }

            String cnic = toDeterministic(citizen.getCnic());
            if (cnic != null && !registerCitizenRepository.existsByCnicAndIdNot(cnic, citizen.getId())) {
                citizen.setCnic(cnic);
                changed = true;
            } else if (cnic != null) {
                log.warn(
                        "Skipping CNIC migration for citizen id={}: deterministic value already used by another account.",
                        citizen.getId()
                );
            }

            if (changed) {
                if (saveCitizen(citizen)) {
                    count++;
                }
            }
        }
        return count;
    }

    private boolean saveCitizen(RegisterCitizen citizen) {
        try {
            registerCitizenRepository.save(citizen);
            return true;
        } catch (DataIntegrityViolationException ex) {
            log.warn(
                    "Could not migrate lookup fields for citizen id={}: {}",
                    citizen.getId(),
                    ex.getMostSpecificCause().getMessage()
            );
            return false;
        }
    }

    private int migrateAdmins() {
        int count = 0;
        for (AdminUser admin : adminUserRepository.findAll()) {
            String contact = toDeterministic(admin.getContactNumber());
            if (contact == null) {
                continue;
            }
            if (adminUserRepository.existsByContactNumberAndUsernameNot(contact, admin.getUsername())) {
                log.warn(
                        "Skipping contact migration for admin username={}: deterministic value already used.",
                        admin.getUsername()
                );
                continue;
            }
            admin.setContactNumber(contact);
            try {
                adminUserRepository.save(admin);
                count++;
            } catch (DataIntegrityViolationException ex) {
                log.warn(
                        "Could not migrate contact for admin username={}: {}",
                        admin.getUsername(),
                        ex.getMostSpecificCause().getMessage()
                );
            }
        }
        return count;
    }

    private int migrateVolunteers() {
        int count = 0;
        for (VolunteerWorkerCreator worker : volunteerWorkerCreatorRepository.findAll()) {
            String phone = toDeterministic(worker.getPhoneNumber());
            if (phone == null) {
                continue;
            }
            if (volunteerWorkerCreatorRepository.existsByPhoneNumberAndUsernameCreatedNot(
                    phone, worker.getUsernameCreated())) {
                log.warn(
                        "Skipping phone migration for volunteer/worker username={}: deterministic value already used.",
                        worker.getUsernameCreated()
                );
                continue;
            }
            worker.setPhoneNumber(phone);
            try {
                volunteerWorkerCreatorRepository.save(worker);
                count++;
            } catch (DataIntegrityViolationException ex) {
                log.warn(
                        "Could not migrate phone for volunteer/worker username={}: {}",
                        worker.getUsernameCreated(),
                        ex.getMostSpecificCause().getMessage()
                );
            }
        }
        return count;
    }

    /**
     * @return deterministic ciphertext when migration is needed, otherwise null
     */
    private String toDeterministic(String stored) {
        if (stored == null || stored.isBlank()) {
            return null;
        }
        try {
            String plain = encryptionService.decrypt(stored);
            String deterministic = encryptionService.encryptDeterministic(plain);
            return stored.equals(deterministic) ? null : deterministic;
        } catch (Exception ex) {
            log.warn("Skipping lookup-field migration for value that could not be decrypted.");
            return null;
        }
    }
}
