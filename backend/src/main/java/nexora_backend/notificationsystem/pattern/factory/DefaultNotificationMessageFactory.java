package nexora_backend.notificationsystem.pattern.factory;

import lombok.RequiredArgsConstructor;
import nexora_backend.database.entity.CivicReport;
import nexora_backend.database.entity.SOSReport;
import nexora_backend.database.enums.NotificationType;
import org.springframework.stereotype.Component;

/**
 * ==========================================
 * DESIGN PATTERN: FACTORY PATTERN
 * ROLE: Concrete Factory
 * ==========================================
 */
@Component
@RequiredArgsConstructor
public class DefaultNotificationMessageFactory implements NotificationMessageFactory {

    @Override
    public String createMessage(NotificationType type, Object entity) {
        return switch (type) {
            case REPORT_SUBMITTED -> buildCivicReportMessage((CivicReport) entity, "A new civic report has been submitted");
            case REPORT_VERIFIED -> buildCivicReportMessage((CivicReport) entity, "Your report has been verified");
            case REPORT_ASSIGNED -> buildCivicReportMessage((CivicReport) entity, "A report has been assigned to you");
            case REPORT_COMPLETED -> buildCivicReportMessage((CivicReport) entity, "Your report has been successfully completed");
            case SOS_SUBMITTED -> buildSosReportMessage((SOSReport) entity);
            case TASK_ASSIGNED -> "A new task has been assigned to you. Please check your dashboard for details.";
            case ACCOUNT_CREATED -> "Welcome to NeXora! Your account has been successfully created.";
            case PASSWORD_RESET -> "A password reset has been requested for your account. Please check your email for the OTP to complete the process.";
            case DISASTER_MODE_ACTIVATED -> "URGENT: Disaster Mode has been activated in your area. Please follow safety protocols.";
            default -> "Notification update for your reference.";
        };
    }

    private String buildCivicReportMessage(CivicReport report, String prefix) {
        if (report == null) return prefix + ".";
        StringBuilder sb = new StringBuilder(prefix);
        sb.append(" (ID: #").append(report.getCivicId()).append("). ");
        
        if (report.getComplaintType() != null) {
            sb.append("Type: ").append(report.getComplaintType().getName()).append(". ");
        }

        sb.append("Location: ");
        if (report.getArea() != null) sb.append(report.getArea()).append(", ");
        if (report.getTown() != null) sb.append(report.getTown()).append(", ");
        if (report.getDistrict() != null) sb.append(report.getDistrict()).append(". ");
        
        return sb.toString().trim();
    }

    private String buildSosReportMessage(SOSReport report) {
        if (report == null) return "URGENT: New SOS Alert received.";
        StringBuilder sb = new StringBuilder("URGENT: New SOS Alert received (ID: #");
        sb.append(report.getSosId()).append("). ");
        
        sb.append("Location: ");
        if (report.getArea() != null) sb.append(report.getArea()).append(", ");
        if (report.getTown() != null) sb.append(report.getTown()).append(", ");
        if (report.getDistrict() != null) sb.append(report.getDistrict()).append(". ");
        
        sb.append("Reported by: ").append(report.getName());
        
        return sb.toString().trim();
    }
}
