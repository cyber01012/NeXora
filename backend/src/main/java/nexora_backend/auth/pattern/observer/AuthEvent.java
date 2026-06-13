package nexora_backend.auth.pattern.observer;

import java.time.Instant;

/**
 * Observer Pattern — marker interface for all authentication domain events.
 */
public interface AuthEvent {

    String eventType();

    Instant occurredAt();
}
