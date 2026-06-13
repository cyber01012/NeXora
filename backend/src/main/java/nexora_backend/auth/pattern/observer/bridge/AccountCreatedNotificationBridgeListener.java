package nexora_backend.auth.pattern.observer.bridge;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.pattern.observer.AuthEventListener;
import nexora_backend.auth.pattern.observer.UserRegisteredEvent;
import nexora_backend.notificationsystem.events.AccountCreatedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/**
 * Forwards auth registration events to the notification module's Spring event bus.
 * Keeps notification-system patterns unchanged while auth uses a custom publisher.
 */
@Component
@RequiredArgsConstructor
public class AccountCreatedNotificationBridgeListener implements AuthEventListener<UserRegisteredEvent> {

    private final ApplicationEventPublisher applicationEventPublisher;

    @Override
    public Class<UserRegisteredEvent> eventType() {
        return UserRegisteredEvent.class;
    }

    @Override
    public void onEvent(UserRegisteredEvent event) {
        applicationEventPublisher.publishEvent(
                new AccountCreatedEvent(this, event.getSourceId())
        );
    }
}
