package nexora_backend.auth.pattern.observer;

import lombok.Builder;
import lombok.Getter;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;

import java.time.Instant;

@Getter
@Builder
public class UserRegisteredEvent implements AuthEvent {

    public static final String TYPE = "USER_REGISTERED";

    private final SystemRole role;
    private final UserSource source;
    private final String sourceId;
    private final Instant occurredAt;

    @Override
    public String eventType() {
        return TYPE;
    }

    @Override
    public Instant occurredAt() {
        return occurredAt;
    }
}
