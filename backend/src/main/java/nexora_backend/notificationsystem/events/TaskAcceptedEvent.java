package nexora_backend.notificationsystem.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskAcceptedEvent extends ApplicationEvent {
    private final String referenceId;

    public TaskAcceptedEvent(Object source, String referenceId) {
        super(source);
        this.referenceId = referenceId;
    }
}
