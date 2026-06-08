//package nexora_backend.independent.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "responder_notification")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ResponderNotification {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "responder_username")
//    private String responderUsername;
//
//    private String title;
//    private String message;
//    private String type;
//
//    @Column(name = "is_read")
//    private Boolean isRead = false;
//
//    @Column(name = "related_task_id")
//    private Long relatedTaskId;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//}