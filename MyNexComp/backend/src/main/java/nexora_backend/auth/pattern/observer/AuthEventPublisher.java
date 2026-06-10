package nexora_backend.auth.pattern.observer;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Observer Pattern — subject that notifies registered listeners when an {@link AuthEvent} occurs.
 * Uses explicit listener registration (not Spring ApplicationEventPublisher).
 */
@Component
public class AuthEventPublisher {

    private final Map<Class<? extends AuthEvent>, List<AuthEventListener<? extends AuthEvent>>> listeners =
            new ConcurrentHashMap<>();

    public <T extends AuthEvent> void subscribe(Class<T> eventType, AuthEventListener<T> listener) {
        listeners.computeIfAbsent(eventType, key -> new ArrayList<>()).add(listener);
    }

    @SuppressWarnings("unchecked")
    public void publish(AuthEvent event) {
        List<AuthEventListener<? extends AuthEvent>> eventListeners =
                listeners.getOrDefault(event.getClass(), List.of());

        for (AuthEventListener listener : eventListeners) {
            listener.onEvent(event);
        }
    }
}
