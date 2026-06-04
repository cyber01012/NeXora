package nexora_backend.auth.pattern.strategy;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.dto.VolunteerWorkerRegistrationRequest;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;

import nexora_backend.auth.service.UserTypeService;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.auth.util.PhoneValidator;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.Department;
import nexora_backend.database.entity.UserType;
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Strategy Pattern — volunteer registration created by an authenticated NGO user.
 */
@Component
@RequiredArgsConstructor
public class VolunteerRegistrationStrategy implements RegistrationStrategy {

    private final AdminUserRepository adminUserRepository;
    private final VolunteerWorkerCreatorRepository volunteerWorkerCreatorRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;

    private final UserTypeService userTypeService;

    @Override
    public SystemRole supportedRole() {
        return SystemRole.VOLUNTEER;
    }

    @Override
    @Transactional
    public RegistrationResponse register(RegistrationContext context) {
        VolunteerWorkerRegistrationRequest request = context.getVolunteerWorkerRequest();
        AuthenticatedUser creator = context.getCreator();

        if (request == null) {
            throw AuthErrors.volunteerRegistrationRequired();
        }
        if (creator == null || creator.getRole() != SystemRole.NGO) {
            throw AuthErrors.onlyNgoCanCreateVolunteers();
        }

        AdminUser ngo = adminUserRepository.findById(creator.getSourceId())
                .orElseThrow(AuthErrors::ngoUserNotFound);

        return persistVolunteerWorker(ngo.getDepartment(), request, SystemRole.VOLUNTEER);
    }

    private RegistrationResponse persistVolunteerWorker(
            Department department,
            VolunteerWorkerRegistrationRequest request,
            SystemRole role
    ) {
        if (department == null) {
            throw AuthErrors.creatorDepartmentRequired();
        }
        if (volunteerWorkerCreatorRepository.existsById(request.getUsernameCreated())) {
            throw AuthErrors.usernameCreatedAlreadyExists();
        }
        if (volunteerWorkerCreatorRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw AuthErrors.emailAlreadyRegistered();
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()) {
            if (!PhoneValidator.isValidFormat(request.getPhoneNumber())) {
                throw AuthErrors.phoneInvalidFormat();
            }
            String normalizedPhone = PhoneValidator.normalize(request.getPhoneNumber());
            if (volunteerWorkerCreatorRepository.existsByPhoneNumber(encryptionService.encryptDeterministic(normalizedPhone))) {
                throw AuthErrors.phoneAlreadyRegistered();
            }
        }

        UserType userType = userTypeService.requireUserType(role);

        String normalizedPhone = request.getPhoneNumber() == null || request.getPhoneNumber().isBlank()
                ? null
                : PhoneValidator.normalize(request.getPhoneNumber());

        VolunteerWorkerCreator worker = VolunteerWorkerCreator.builder()
                .usernameCreated(request.getUsernameCreated())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .phoneNumber(normalizedPhone == null ? null : encryptionService.encryptDeterministic(normalizedPhone))
                .email(request.getEmail())
                .emailVerified(true)
                .userType(userType)
                .profilePic(request.getProfilePic())
                .createdDate(LocalDate.now())
                .createdTime(LocalTime.now())
                .department(department)
                .build();

        volunteerWorkerCreatorRepository.save(worker);

        return RegistrationResponse.builder()
                .message(role.name() + " account created successfully.")
                .source(UserSource.VOLUNTEER_WORKER)
                .sourceId(worker.getUsernameCreated())
                .emailVerificationRequired(false)
                .build();
    }
}
