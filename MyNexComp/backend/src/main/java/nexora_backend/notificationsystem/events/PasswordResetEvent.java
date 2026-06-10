package nexora_backend.notificationsystem.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class PasswordResetEvent extends ApplicationEvent {
    private final String sourceId;

    public PasswordResetEvent(Object source, String sourceId) {
        super(source);
        this.sourceId = sourceId;
    }
}
