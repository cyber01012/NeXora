package nexora_backend.notificationsystem.pattern.command;

import lombok.RequiredArgsConstructor;
import nexora_backend.database.entity.Notification;
import nexora_backend.database.repository.NotificationRepository;
import org.springframework.stereotype.Component;

/**
 * ==========================================
 * DESIGN PATTERN: COMMAND PATTERN
 * ROLE: Receiver
 * ==========================================
 * Knows how to perform the actual operations.
 * Decouples Command from infrastructure (Repository).
 */
@Component
@RequiredArgsConstructor
public class NotificationReceiver {

    private final NotificationRepository repository;

    public void save(Notification notification) {
        repository.save(notification);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}