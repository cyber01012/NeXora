package nexora_backend.auth.pattern.observer;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.service.MailService;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — sends a security notification after a password change.
 */
@Component
@RequiredArgsConstructor
public class SecurityNotificationListener implements AuthEventListener<PasswordChangedEvent> {

    private final MailService mailService;

    @Override
    public Class<PasswordChangedEvent> eventType() {
        return PasswordChangedEvent.class;
    }

    @Override
    public void onEvent(PasswordChangedEvent event) {
        if (event.getEmail() == null || event.getEmail().isBlank()) {
            return;
        }
        mailService.sendPasswordChangedNotification(event.getEmail());
    }
}
