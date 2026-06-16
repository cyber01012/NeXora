package nexora_backend.database.repository;

import nexora_backend.database.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(String recipientId);
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    long countByRecipientIdAndIsReadFalse(String recipientId);

// ✅ NEW: Role-aware queries
    @Query("SELECT n FROM Notification n WHERE " + "(n.recipientId = :recipientId) OR " +
            "(n.recipientRole = :role AND n.recipientId = 'SYSTEM') " +
            "ORDER BY n.createdAt DESC") List<Notification> findAllForUser(@Param("recipientId") String recipientId, @Param("role") String role);

    @Query("SELECT n FROM Notification n WHERE " +
            "((n.recipientId = :recipientId) OR (n.recipientRole = :role AND n.recipientId = 'SYSTEM')) " +
            "AND n.isRead = false " +
            "ORDER BY n.createdAt DESC")
    List<Notification> findUnreadForUser(@Param("recipientId") String recipientId, @Param("role") String role);

    @Query("SELECT COUNT(n) FROM Notification n WHERE " +
            "((n.recipientId = :recipientId) OR (n.recipientRole = :role AND n.recipientId = 'SYSTEM')) " +
            "AND n.isRead = false")
    long countUnreadForUser(@Param("recipientId") String recipientId, @Param("role") String role);
}
