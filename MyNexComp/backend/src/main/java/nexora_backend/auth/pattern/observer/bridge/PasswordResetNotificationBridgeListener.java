package nexora_backend.auth.pattern.observer.bridge;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.pattern.observer.AuthEventListener;
import nexora_backend.auth.pattern.observer.PasswordResetTriggeredEvent;
import nexora_backend.notificationsystem.events.PasswordResetEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/**
 * Forwards auth observer events to the notification module's Spring event bus.
 * Keeps notification-system patterns unchanged while auth uses a custom publisher.
 */
@Component
@RequiredArgsConstructor
public class PasswordResetNotificationBridgeListener implements AuthEventListener<PasswordResetTriggeredEvent> {

    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public Class<PasswordResetTriggeredEvent> eventType() {
        return PasswordResetTriggeredEvent.class;
    }

    @Override
    public void onEvent(PasswordResetTriggeredEvent event) {
        applicationEventPublisher.publishEvent(
                new PasswordResetEvent(this, event.getSourceId())
        );
    }
}
