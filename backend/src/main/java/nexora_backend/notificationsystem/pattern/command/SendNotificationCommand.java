package nexora_backend.notificationsystem.pattern.command;

import lombok.Builder;
import nexora_backend.database.entity.Notification;
import nexora_backend.database.enums.NotificationChannel;
import nexora_backend.database.enums.NotificationType;

import java.time.LocalDateTime;

/**
 * ==========================================
 * DESIGN PATTERN: COMMAND PATTERN
 * ROLE: Concrete Command
 * ==========================================
 * Encapsulates a notification send request as an object.
 * Holds all parameters needed to execute the command.
 * Delegates actual saving to NotificationReceiver (Receiver).
 */
@Builder
public class SendNotificationCommand implements NotificationCommand {

    private final NotificationReceiver receiver;
    private final String recipientId;
    private final String recipientRole;
    private final NotificationType type;
    private final NotificationChannel channel;
    private final String referenceType;
    private final String referenceId;
    private final String message;

    @Override
    public void execute() {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .recipientRole(recipientRole)
                .type(type.name())
                .channel(channel.name())
                .referenceType(referenceType)
                .referenceId(referenceId)
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        receiver.save(notification);
    }
}