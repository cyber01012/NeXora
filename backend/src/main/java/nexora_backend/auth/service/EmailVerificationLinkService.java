package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.config.AuthProperties;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.UserSource;

import nexora_backend.database.entity.RegisterCitizen;

import nexora_backend.database.repository.RegisterCitizenRepository;

import org.springframework.stereotype.Service;

/**
 * Sends the same frontend verification-link email used for citizens to all account types.
 */
@Service
@RequiredArgsConstructor
public class EmailVerificationLinkService {

    private final EmailVerificationTokenService emailVerificationTokenService;
    private final MailService mailService;
    private final AuthProperties authProperties;
    private final RegisterCitizenRepository registerCitizenRepository;


    public void sendVerificationLink(UserSource source, String sourceId, String email) {
        assertCanSendVerificationLink(source, sourceId, email);
        String token = emailVerificationTokenService.generateAndStoreToken(source, sourceId, email.trim());
        mailService.sendEmailVerificationLink(email.trim(), buildVerificationUrl(token));
    }

    public void assertTokenMatchesAccount(EmailVerificationTokenService.EmailVerificationTokenData tokenData) {
        assertCanSendVerificationLink(tokenData.source(), tokenData.sourceId(), tokenData.email());
    }

    public void assertCanSendVerificationLink(UserSource source, String sourceId, String email) {
        String normalizedEmail = email == null ? "" : email.trim();
        if (normalizedEmail.isBlank()) {
            throw AuthErrors.emailNotFound();
        }

        if (source != UserSource.CITIZEN) {
            throw AuthErrors.unsupportedUserSource();
        }

        RegisterCitizen citizen = registerCitizenRepository.findById(Long.parseLong(sourceId))
                .orElseThrow(AuthErrors::citizenNotFound);
        if (citizen.getEmail() == null || !citizen.getEmail().equalsIgnoreCase(normalizedEmail)) {
            throw AuthErrors.emailNotFound();
        }
        if (Boolean.TRUE.equals(citizen.getEmailVerified())) {
            throw AuthErrors.emailAlreadyVerified();
        }
    }

    public String buildVerificationUrl(String token) {
        String baseUrl = authProperties.getFrontendUrl();
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        return baseUrl + "/verify-email?token=" + token;
    }
}
