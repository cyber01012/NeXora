package nexora_backend.auth.pattern.observer;

/**
 * Observer Pattern — contract for objects that react to {@link AuthEvent} publications.
 *
 * @param <T> the concrete event type this listener handles
 */
public interface AuthEventListener<T extends AuthEvent> {

    Class<T> eventType();

    void onEvent(T event);
}
