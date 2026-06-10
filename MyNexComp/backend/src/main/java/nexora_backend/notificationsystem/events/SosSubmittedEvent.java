package nexora_backend.notificationsystem.events;

import lombok.Getter;
import nexora_backend.database.entity.SOSReport;
import org.springframework.context.ApplicationEvent;

@Getter
public class SosSubmittedEvent extends ApplicationEvent {
    private final SOSReport sosReport;
    private final Long sosId;

    public SosSubmittedEvent(Object source, SOSReport sosReport) {
        super(source);
        this.sosReport = sosReport;
        this.sosId = sosReport.getSosId();
    }
}
