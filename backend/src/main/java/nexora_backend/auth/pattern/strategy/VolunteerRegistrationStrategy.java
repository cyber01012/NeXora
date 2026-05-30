package nexora_backend.auth.pattern.strategy;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.dto.VolunteerWorkerRegistrationRequest;
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
import nexora_backend.database.entity.VolunteerWorkerCreator;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import org.springframework.http.HttpStatus;
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
    private final OtpService otpService;
    private final MailService mailService;
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
            throw new AuthException(HttpStatus.BAD_REQUEST, "Volunteer registration request is required");
        }
        if (creator == null || creator.getRole() != SystemRole.NGO) {
            throw new AuthException(HttpStatus.FORBIDDEN, "Only NGO users can create volunteers");
        }

        AdminUser ngo = adminUserRepository.findById(creator.getSourceId())
                .orElseThrow(() -> new AuthException(HttpStatus.NOT_FOUND, "NGO user not found"));

        return persistVolunteerWorker(ngo.getDepartment(), request, SystemRole.VOLUNTEER);
    }

    private RegistrationResponse persistVolunteerWorker(
            Department department,
            VolunteerWorkerRegistrationRequest request,
            SystemRole role
    ) {
        if (department == null) {
            throw new AuthException(HttpStatus.BAD_REQUEST, "Creator department is required");
        }
        if (volunteerWorkerCreatorRepository.existsById(request.getUsernameCreated())) {
            throw new AuthException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (volunteerWorkerCreatorRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AuthException(HttpStatus.CONFLICT, "Email already registered");
        }
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank()
                && volunteerWorkerCreatorRepository.existsByPhoneNumber(
                encryptionService.encrypt(request.getPhoneNumber()))) {
            throw new AuthException(HttpStatus.CONFLICT, "Phone number already registered");
        }

        UserType userType = userTypeService.requireUserType(role);

        VolunteerWorkerCreator worker = VolunteerWorkerCreator.builder()
                .usernameCreated(request.getUsernameCreated())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .phoneNumber(request.getPhoneNumber() == null || request.getPhoneNumber().isBlank()
                        ? null
                        : encryptionService.encrypt(request.getPhoneNumber()))
                .email(request.getEmail())
                .emailVerified(false)
                .userType(userType)
                .profilePic(request.getProfilePic())
                .createdDate(LocalDate.now())
                .createdTime(LocalTime.now())
                .department(department)
                .build();

        volunteerWorkerCreatorRepository.save(worker);

        String otp = otpService.generateAndStoreOtp(
                UserSource.VOLUNTEER_WORKER, worker.getUsernameCreated(), OtpPurpose.EMAIL_VERIFICATION, request.getEmail());
        mailService.sendOtpEmail(request.getEmail(), otp, "Email Verification");

        return RegistrationResponse.builder()
                .message(role.name() + " account created successfully. Email verification required.")
                .source(UserSource.VOLUNTEER_WORKER)
                .sourceId(worker.getUsernameCreated())
                .emailVerificationRequired(true)
                .build();
    }
}
