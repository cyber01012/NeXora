package nexora_backend.auth.pattern.observer;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.service.MailService;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — sends a welcome email when email verification succeeds.
 */
@Component
@RequiredArgsConstructor
public class WelcomeEmailListener implements AuthEventListener<EmailVerifiedEvent> {

    private final MailService mailService;

    @Override
    public Class<EmailVerifiedEvent> eventType() {
        return EmailVerifiedEvent.class;
    }

    @Override
    public void onEvent(EmailVerifiedEvent event) {
        if (event.getEmail() == null || event.getEmail().isBlank()) {
            return;
        }
        mailService.sendWelcomeEmail(event.getEmail(), event.getDisplayName());
    }
}
