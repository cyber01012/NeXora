package nexora_backend.auth.pattern.observer;

import lombok.Builder;
import lombok.Getter;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;

import java.time.Instant;

@Getter
@Builder
public class EmailVerifiedEvent implements AuthEvent {

    public static final String TYPE = "EMAIL_VERIFIED";

    private final UserSource source;
    private final String sourceId;
    private final SystemRole role;
    private final String email;
    private final String displayName;
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
