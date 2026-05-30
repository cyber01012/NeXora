package nexora_backend.auth.pattern.observer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — audit logging for email verification events.
 */
@Slf4j
@Component
public class AuditLogListener implements AuthEventListener<EmailVerifiedEvent> {

    @Override
    public Class<EmailVerifiedEvent> eventType() {
        return EmailVerifiedEvent.class;
    }

    @Override
    public void onEvent(EmailVerifiedEvent event) {
        log.info(
                "AUDIT eventType={} userId={} role={} timestamp={}",
                event.eventType(),
                event.getSourceId(),
                event.getRole(),
                event.getOccurredAt()
        );
    }
}
