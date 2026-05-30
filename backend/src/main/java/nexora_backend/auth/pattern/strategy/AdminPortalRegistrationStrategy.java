package nexora_backend.auth.pattern.strategy;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.AdminUserRegistrationRequest;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.exception.AuthException;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.OtpPurpose;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.service.MailService;
import nexora_backend.auth.service.OtpService;
import nexora_backend.auth.service.UserTypeService;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.Department;
import nexora_backend.database.entity.UserType;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.DepartmentRepository;
import org.springframework.http.HttpStatus;
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
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final OtpService otpService;
    private final MailService mailService;
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
            throw new AuthException(HttpStatus.BAD_REQUEST, "Admin portal registration request is required");
        }
        if (!ADMIN_CREATABLE_ROLES.contains(targetRole)) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Admin portal strategy cannot create role: " + targetRole);
        }

        assertAdminCreator(creator, targetRole);
        validateCategoryForRole(targetRole, request.getCategory());

        if (adminUserRepository.existsById(request.getUsername())) {
            throw new AuthException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (adminUserRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AuthException(HttpStatus.CONFLICT, "Email already registered");
        }
        if (adminUserRepository.existsByContactNumber(encryptionService.encrypt(request.getContactNumber()))) {
            throw new AuthException(HttpStatus.CONFLICT, "Contact number already registered");
        }

        UserType userType = userTypeService.requireUserType(targetRole);
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new AuthException(HttpStatus.BAD_REQUEST, "Department not found"));

        AdminUser adminUser = AdminUser.builder()
                .username(request.getUsername())
                .userType(userType)
                .name(request.getName())
                .contactNumber(encryptionService.encrypt(request.getContactNumber()))
                .email(request.getEmail())
                .emailVerified(false)
                .active(true)
                .password(passwordEncoder.encode(request.getPassword()))
                .date(LocalDate.now())
                .time(LocalTime.now())
                .category(targetRole == SystemRole.NGO ? request.getCategory() : null)
                .department(department)
                .build();

        adminUserRepository.save(adminUser);

        String otp = otpService.generateAndStoreOtp(
                UserSource.ADMIN_USER, adminUser.getUsername(), OtpPurpose.EMAIL_VERIFICATION, request.getEmail());
        mailService.sendOtpEmail(request.getEmail(), otp, "Email Verification");

        return RegistrationResponse.builder()
                .message(targetRole.name() + " account created successfully. Email verification required.")
                .source(UserSource.ADMIN_USER)
                .sourceId(adminUser.getUsername())
                .emailVerificationRequired(true)
                .build();
    }

    private void assertAdminCreator(AuthenticatedUser creator, SystemRole targetRole) {
        if (creator == null || creator.getRole() != SystemRole.ADMIN) {
            throw new AuthException(HttpStatus.FORBIDDEN, "Only admin users can create portal accounts");
        }
        if (!ADMIN_CREATABLE_ROLES.contains(targetRole)) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Admin cannot create role: " + targetRole);
        }
    }

    private void validateCategoryForRole(SystemRole targetRole, String category) {
        if (targetRole == SystemRole.NGO) {
            if (category == null || category.isBlank()) {
                throw new AuthException(HttpStatus.BAD_REQUEST, "NGO category is required for NGO users");
            }
            return;
        }
        if (category != null && !category.isBlank()) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Category applies only to NGO users");
        }
    }
}
