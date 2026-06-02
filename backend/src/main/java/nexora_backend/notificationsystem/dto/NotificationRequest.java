package nexora_backend.notificationsystem.dto;

import nexora_backend.database.enums.NotificationChannel;
import nexora_backend.database.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

/**
 * ==========================================
 * DESIGN PATTERN: COMMAND PATTERN
 * ROLE: Command Object
 * ==========================================
 * This class represents the "Command" in the Command Pattern.
 * It encapsulates all the information needed to perform an action or trigger an event
 * at a later time. In this case, the action is sending a notification.
 * 
 * By encapsulating the request as an object (NotificationCommand), we can pass it,
 * queue it, or log it without the sender needing to know how the notification is 
 * actually delivered (e.g., via email, SMS, or in-app).
 * 
 * The sender simply creates this Command and hands it to the Invoker/Receiver (NotificationService).
 */
@Data
@Builder
public class NotificationRequest {
    private String recipientId;
    private String recipientRole;
    private NotificationType type;
    private NotificationChannel channel;
    private String referenceType;
    private Long referenceId;
    private String message;
}
