package nexora_backend.notificationsystem.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class TaskAssignedEvent extends ApplicationEvent {
    private final String referenceId;

    public TaskAssignedEvent(Object source, String referenceId) {
        super(source);
        this.referenceId = referenceId;
    }
}
