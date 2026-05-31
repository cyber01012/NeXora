package nexora_backend.notificationsystem.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class DisasterModeActivatedEvent extends ApplicationEvent {
    public DisasterModeActivatedEvent(Object source) {
        super(source);
    }
}
