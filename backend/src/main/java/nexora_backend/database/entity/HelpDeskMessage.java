package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "help_desk_message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HelpDeskMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_username")
    private String senderUsername;

    @Column(name = "receiver_username")
    private String receiverUsername;

    private String message;

    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}