package nexora_backend.notificationsystem.events;

import lombok.Getter;
import nexora_backend.database.entity.CivicReport;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReportVerifiedEvent extends ApplicationEvent {
    private final CivicReport report;
    private final Long reportId;

    public ReportVerifiedEvent(Object source, CivicReport report) {
        super(source);
        this.report = report;
        this.reportId = report.getCivicId();
    }
}
