package nexora_backend.auth.pattern.strategy;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.AdminUserRegistrationRequest;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.service.EmailVerificationLinkService;
import nexora_backend.auth.service.UserTypeService;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.auth.util.PhoneValidator;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.Department;
import nexora_backend.database.entity.ResponderType;
import nexora_backend.database.entity.UserType;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.DepartmentRepository;
import nexora_backend.database.repository.ResponderTypeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.EnumSet;

/**
 * Strategy Pattern — admin-portal registration for NGO, Help Desk, Assigning Officer, and Responder.
 */
@Component
@RequiredArgsConstructor
public class AdminPortalRegistrationStrategy implements RegistrationStrategy {

    private static final EnumSet<SystemRole> ADMIN_CREATABLE_ROLES = EnumSet.of(
            SystemRole.NGO,
            SystemRole.HELP_DESK,
            SystemRole.ASSIGNING_OFFICER,
            SystemRole.RESPONDER
    );

    private final AdminUserRepository adminUserRepository;
    private final DepartmentRepository departmentRepository;
    private final ResponderTypeRepository responderTypeRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final EmailVerificationLinkService emailVerificationLinkService;
    private final UserTypeService userTypeService;

    @Override
    public SystemRole supportedRole() {
        return SystemRole.NGO;
    }

    @Override
    @Transactional
    public RegistrationResponse register(RegistrationContext context) {
        SystemRole targetRole = context.getTargetRole();
        AdminUserRegistrationRequest request = context.getAdminUserRequest();
        AuthenticatedUser creator = context.getCreator();

        if (request == null || targetRole == null) {
            throw AuthErrors.adminRegistrationRequired();
        }
        if (!ADMIN_CREATABLE_ROLES.contains(targetRole)) {
            throw AuthErrors.unsupportedPortalRole(targetRole.name());
        }

        assertAdminCreator(creator, targetRole);
        validateResponderTypeForRole(targetRole, request.getResponderTypeId());

        if (!PhoneValidator.isValidFormat(request.getContactNumber())) {
            throw AuthErrors.contactNumberInvalidFormat();
        }
        String normalizedContact = PhoneValidator.normalize(request.getContactNumber());

        if (adminUserRepository.existsById(request.getUsername())) {
            throw AuthErrors.usernameAlreadyExists();
        }
        if (adminUserRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw AuthErrors.emailAlreadyRegistered();
        }
        if (adminUserRepository.existsByContactNumber(encryptionService.encryptDeterministic(normalizedContact))) {
            throw AuthErrors.contactNumberAlreadyRegistered();
        }

        UserType userType = userTypeService.requireUserType(targetRole);
        ResponderType responderType = resolveResponderType(targetRole, request.getResponderTypeId());
        Department department = resolveDepartment(targetRole, responderType);

        AdminUser adminUser = AdminUser.builder()
                 .username(request.getUsername())
                 .userType(userType)
                 .name(request.getName())
                 .contactNumber(encryptionService.encryptDeterministic(normalizedContact))
                 .email(request.getEmail())
                 .emailVerified(true)
                 .active(true)
                 .password(passwordEncoder.encode(request.getPassword()))
                 .date(LocalDate.now())
                 .time(LocalTime.now())
                 .category(department.getResponderTypeCategory())
                 .responderType(responderType)
                 .department(department)
                 .build();

        adminUserRepository.save(adminUser);

        return RegistrationResponse.builder()
                .message(targetRole.name() + " account created successfully.")
                .source(UserSource.ADMIN_USER)
                .sourceId(adminUser.getUsername())
                .emailVerificationRequired(false)
                .build();
    }

    private void assertAdminCreator(AuthenticatedUser creator, SystemRole targetRole) {
        if (creator == null || creator.getRole() != SystemRole.ADMIN) {
            throw AuthErrors.onlyAdminCanCreatePortalAccounts();
        }
        if (!ADMIN_CREATABLE_ROLES.contains(targetRole)) {
            throw AuthErrors.adminCannotCreateRole(targetRole.name());
        }
    }

    private Department resolveDepartment(SystemRole targetRole, ResponderType responderType) {
        return switch (targetRole) {
            case NGO -> departmentRepository
                    .findFirstByResponderTypeCategoryIgnoreCaseAndActiveTrueOrderByDeptNameAsc("NGO")
                    .orElseThrow(AuthErrors::departmentNotFound);
            case HELP_DESK, ASSIGNING_OFFICER -> departmentRepository
                    .findFirstByResponderTypeCategoryIgnoreCaseAndActiveTrueOrderByDeptNameAsc("GOV")
                    .orElseThrow(AuthErrors::departmentNotFound);
            case RESPONDER -> departmentRepository
                    .findFirstByResponderType_IdAndActiveTrueOrderByDeptNameAsc(responderType.getId())
                    .orElseThrow(AuthErrors::departmentNotFound);
            default -> throw AuthErrors.unsupportedPortalRole(targetRole.name());
        };
    }

    private void validateResponderTypeForRole(SystemRole targetRole, String responderTypeId) {
        if (targetRole == SystemRole.RESPONDER) {
            if (responderTypeId == null || responderTypeId.isBlank()) {
                throw AuthErrors.responderTypeRequired();
            }
            return;
        }
        if (responderTypeId != null && !responderTypeId.isBlank()) {
            throw AuthErrors.responderTypeNotApplicable();
        }
    }

    private ResponderType resolveResponderType(SystemRole targetRole, String responderTypeId) {
        if (targetRole != SystemRole.RESPONDER) {
            return null;
        }
        return responderTypeRepository.findById(responderTypeId.trim())
                .orElseThrow(AuthErrors::responderTypeNotFound);
    }
}
