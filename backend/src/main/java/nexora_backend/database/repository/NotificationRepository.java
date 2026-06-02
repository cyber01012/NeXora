package nexora_backend.database.repository;

import nexora_backend.database.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(String recipientId);
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    long countByRecipientIdAndIsReadFalse(String recipientId);
}
