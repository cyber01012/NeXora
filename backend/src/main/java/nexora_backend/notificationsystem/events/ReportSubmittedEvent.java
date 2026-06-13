package nexora_backend.notificationsystem.events;

import lombok.Getter;
import nexora_backend.database.entity.CivicReport;
import org.springframework.context.ApplicationEvent;

@Getter
public class ReportSubmittedEvent extends ApplicationEvent {
    private final CivicReport report;
    private final Long reportId;
    private final Long citizenId;

    public ReportSubmittedEvent(Object source, CivicReport report) {
        super(source);
        this.report = report;
        this.reportId = report.getCivicId();
        this.citizenId = report.getCitizen() != null ? report.getCitizen().getId() : null;
    }
}
