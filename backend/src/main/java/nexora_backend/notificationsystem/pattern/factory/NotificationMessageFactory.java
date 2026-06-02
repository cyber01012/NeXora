package nexora_backend.notificationsystem.pattern.factory;

import nexora_backend.database.enums.NotificationType;

/**
 * ==========================================
 * DESIGN PATTERN: FACTORY PATTERN
 * ROLE: Abstract Factory / Factory Interface
 * ==========================================
 */
public interface NotificationMessageFactory {
    String createMessage(NotificationType type, Object entity);
}
