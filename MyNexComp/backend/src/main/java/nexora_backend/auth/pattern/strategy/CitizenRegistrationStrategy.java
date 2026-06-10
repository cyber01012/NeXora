package nexora_backend.auth.pattern.strategy;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.CitizenRegistrationRequest;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.util.CnicValidator;
import nexora_backend.auth.util.EncryptionService;
import nexora_backend.auth.util.PhoneValidator;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.repository.RegisterCitizenRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Strategy Pattern — citizen self-registration from the landing page.
 */
@Component
@RequiredArgsConstructor
public class CitizenRegistrationStrategy implements RegistrationStrategy {

    private final RegisterCitizenRepository registerCitizenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;

    @Override
    public SystemRole supportedRole() {
        return SystemRole.CITIZEN;
    }

    @Override
    @Transactional
    public RegistrationResponse register(RegistrationContext context) {
        CitizenRegistrationRequest request = context.getCitizenRequest();
        if (request == null) {
            throw AuthErrors.citizenRegistrationRequired();
        }

        if (!PhoneValidator.isValidFormat(request.getPhoneNumber())) {
            throw AuthErrors.phoneInvalidFormat();
        }
        String normalizedPhone = PhoneValidator.normalize(request.getPhoneNumber());

        if (request.getEmail() != null && !request.getEmail().isBlank()
                && registerCitizenRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw AuthErrors.emailAlreadyRegistered();
        }
        if (registerCitizenRepository.existsByPhoneNumber(encryptionService.encryptDeterministic(normalizedPhone))) {
            throw AuthErrors.phoneAlreadyRegistered();
        }
        String normalizedCnic = null;
        if (request.getCnic() != null && !request.getCnic().isBlank()) {
            if (!CnicValidator.isValidFormat(request.getCnic())) {
                throw AuthErrors.cnicInvalidFormat();
            }
            normalizedCnic = CnicValidator.normalize(request.getCnic());
            if (registerCitizenRepository.existsByCnic(encryptionService.encryptDeterministic(normalizedCnic))) {
                throw AuthErrors.cnicAlreadyRegistered();
            }
        }

        boolean hasEmail = request.getEmail() != null && !request.getEmail().isBlank();
        boolean hasCnic = normalizedCnic != null;

        RegisterCitizen citizen = RegisterCitizen.builder()
                .fullName(request.getFullName())
                .phoneNumber(encryptionService.encryptDeterministic(normalizedPhone))
                .address(request.getAddress())
                .city(request.getCity())
                .email(hasEmail ? request.getEmail() : null)
                .cnic(hasCnic ? encryptionService.encryptDeterministic(normalizedCnic) : null)
                .password(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .cnicValidated(hasCnic)
                .entryDate(LocalDate.now())
                .entryTime(LocalTime.now())
                .build();

        citizen = registerCitizenRepository.save(citizen);

        return RegistrationResponse.builder()
                .message(buildRegistrationMessage(hasEmail, hasCnic))
                .source(UserSource.CITIZEN)
                .sourceId(String.valueOf(citizen.getId()))
                .emailVerificationRequired(hasEmail)
                .build();
    }

    private String buildRegistrationMessage(boolean hasEmail, boolean hasCnic) {
        if (hasEmail && hasCnic) {
            return "Account created successfully. You can verify your email anytime to unlock your Platinum citizen badge.";
        }
        if (hasEmail) {
            return "Account created successfully. Verify your email when you're ready to unlock badge benefits.";
        }
        if (hasCnic) {
            return "Account created with validated CNIC. Add and verify email for a higher badge tier.";
        }
        return "Account created successfully. Add and verify email or CNIC to earn a citizen badge.";
    }
}
