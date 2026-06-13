package nexora_backend.notificationsystem.pattern.observer;

import lombok.RequiredArgsConstructor;
import nexora_backend.database.enums.NotificationChannel;
import nexora_backend.database.enums.NotificationType;
import nexora_backend.notificationsystem.events.*;
import nexora_backend.notificationsystem.pattern.command.NotificationReceiver;
import nexora_backend.notificationsystem.pattern.command.SendNotificationCommand;
import nexora_backend.notificationsystem.pattern.factory.NotificationMessageFactory;
import nexora_backend.notificationsystem.service.NotificationService;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * ==========================================
 * DESIGN PATTERN: OBSERVER PATTERN (SPRING)
 * ROLE: Concrete Observer
 * ==========================================
 * Reacts to fully enriched events without repository queries.
 */
@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final NotificationMessageFactory messageFactory;
    private final NotificationReceiver notificationReceiver;

    @Async
    @EventListener
    public void handleReportSubmitted(ReportSubmittedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.REPORT_SUBMITTED, event.getReport());
        dispatch(
            event.getCitizenId() != null ? String.valueOf(event.getCitizenId()) : null,
            "HELP_DESK",
            NotificationType.REPORT_SUBMITTED,
            "REPORT",
            String.valueOf(event.getReportId()),
            msg
        );
    }

    @Async
    @EventListener
    public void handleSosSubmitted(SosSubmittedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.SOS_SUBMITTED, event.getSosReport());
        dispatch(
            null,
            "HELP_DESK",
            NotificationType.SOS_SUBMITTED,
            "SOS",
            String.valueOf(event.getSosId()),
            msg
        );
    }

    @Async
    @EventListener
    public void handleReportVerified(ReportVerifiedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.REPORT_VERIFIED, event.getReport());
        dispatch(
            null,
            "ASSIGNING_OFFICER",
            NotificationType.REPORT_VERIFIED,
            "REPORT",
            String.valueOf(event.getReportId()),
            msg
        );
    }

    @Async
    @EventListener
    public void handleReportAssigned(ReportAssignedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.REPORT_ASSIGNED, event.getReport());
        if (event.getCitizenId() != null) {
            dispatch(
                String.valueOf(event.getCitizenId()),
                "CITIZEN",
                NotificationType.REPORT_ASSIGNED,
                "REPORT",
                String.valueOf(event.getReportId()),
                msg
            );
        }
    }

    @Async
    @EventListener
    public void handleReportCompleted(ReportCompletedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.REPORT_COMPLETED, event.getReport());
        if (event.getCitizenId() != null) {
            dispatch(
                String.valueOf(event.getCitizenId()),
                "CITIZEN",
                NotificationType.REPORT_COMPLETED,
                "REPORT",
                String.valueOf(event.getReportId()),
                msg
            );
        }
    }
    
    @Async
    @EventListener
    public void handleReportRejected(ReportRejectedByDeptEvent event) {
        dispatch(
            event.getCitizenId() != null ? String.valueOf(event.getCitizenId()) : null,
            "CITIZEN",
            NotificationType.REPORT_REJECTED_BY_DEPT,
            "REPORT",
            String.valueOf(event.getReportId()),
            "Your report #" + event.getReportId() + " has been rejected by the department."
        );
    }

    @Async
    @EventListener
    public void handleTaskAssigned(TaskAssignedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.TASK_ASSIGNED, null);
        dispatch(
            null,
            "WORKER",
            NotificationType.TASK_ASSIGNED,
            "TASK",
            event.getReferenceId(),
            msg
        );
    }

    @Async
    @EventListener
    public void handleTaskAccepted(TaskAcceptedEvent event) {
        dispatch(
            null,
            "RESPONDER",
            NotificationType.TASK_ACCEPTED,
            "TASK",
            event.getReferenceId(),
            "Task #" + event.getReferenceId() + " has been accepted."
        );
    }

    @Async
    @EventListener
    public void handleTaskDisposed(TaskDisposedEvent event) {
        dispatch(
            null,
            "RESPONDER",
            NotificationType.TASK_DISPOSED,
            "TASK",
            event.getReferenceId(),
            "Task #" + event.getReferenceId() + " has been disposed."
        );
    }

    @Async
    @EventListener
    public void handleTaskRejected(TaskRejectedEvent event) {
        dispatch(
            null,
            "RESPONDER",
            NotificationType.TASK_REJECTED,
            "TASK",
            event.getReferenceId(),
            "Task #" + event.getReferenceId() + " has been rejected."
        );
    }

    @Async
    @EventListener
    public void handleAccountCreated(AccountCreatedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.ACCOUNT_CREATED, null);
        dispatch(
            event.getSourceId(),
            "USER",
            NotificationType.ACCOUNT_CREATED,
            "USER",
            "0",
            msg
        );
    }

    @Async
    @EventListener
    public void handlePasswordReset(PasswordResetEvent event) {
        String msg = messageFactory.createMessage(NotificationType.PASSWORD_RESET, null);
        dispatch(
            event.getSourceId(),
            "USER",
            NotificationType.PASSWORD_RESET,
            "USER",
            "0",
            msg
        );
    }

    @Async
    @EventListener
    public void handleDisasterModeActivated(DisasterModeActivatedEvent event) {
        String msg = messageFactory.createMessage(NotificationType.DISASTER_MODE_ACTIVATED, null);
        dispatch(
            null,
            "ADMIN",
            NotificationType.DISASTER_MODE_ACTIVATED,
            "SYSTEM",
            "0",
            msg
        );
    }

    private void dispatch(String recipientId, String recipientRole, NotificationType type,
                          String refType, String refId, String msg) {
        SendNotificationCommand command = SendNotificationCommand.builder()
                .receiver(notificationReceiver)
                .recipientId(recipientId != null ? recipientId : "SYSTEM")
                .recipientRole(recipientRole)
                .type(type)
                .channel(NotificationChannel.IN_APP)
                .referenceType(refType)
                .referenceId(refId)
                .message(msg)
                .build();

        notificationService.executeCommand(command);
    }
}
