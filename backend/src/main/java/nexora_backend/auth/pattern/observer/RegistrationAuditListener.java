package nexora_backend.auth.pattern.observer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — audit logging for successful user registration.
 */
@Slf4j
@Component
public class RegistrationAuditListener implements AuthEventListener<UserRegisteredEvent> {

    @Override
    public Class<UserRegisteredEvent> eventType() {
        return UserRegisteredEvent.class;
    }

    @Override
    public void onEvent(UserRegisteredEvent event) {
        log.info(
                "REGISTRATION AUDIT role={} source={} sourceId={} timestamp={} eventType={}",
                event.getRole(),
                event.getSource(),
                event.getSourceId(),
                event.getOccurredAt(),
                event.eventType()
        );
    }
}
