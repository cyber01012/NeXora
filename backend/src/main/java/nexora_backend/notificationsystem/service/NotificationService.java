package nexora_backend.notificationsystem.service;

import nexora_backend.database.entity.Notification;
import nexora_backend.database.repository.NotificationRepository;
import nexora_backend.notificationsystem.pattern.command.NotificationCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ==========================================
 * DESIGN PATTERN: COMMAND PATTERN
 * ROLE: Invoker
 * ==========================================
 * The NotificationService acts as the Invoker in the Command Pattern.
 * It triggers the execution of encapsulated requests (Commands).
 */
@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Transactional
    public void executeCommand(NotificationCommand command) {
        command.execute();
    }

    @Transactional
    public void markAsRead(Long notificationId, String recipientId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            if (notification.getRecipientId().equals(recipientId)) {
                notification.setRead(true);
                notification.setReadAt(LocalDateTime.now());
                notificationRepository.save(notification);
            }
        });
    }

    @Transactional
    public void markAllAsRead(String recipientId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(recipientId);
        LocalDateTime now = LocalDateTime.now();
        unread.forEach(n -> {
            n.setRead(true);
            n.setReadAt(now);
        });
        notificationRepository.saveAll(unread);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnread(String recipientId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(recipientId);
    }

    @Transactional(readOnly = true)
    public List<Notification> getAll(String recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String recipientId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(recipientId);
    }
}
