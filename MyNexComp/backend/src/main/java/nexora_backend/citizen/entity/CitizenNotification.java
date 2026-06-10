package nexora_backend.citizen.entity;//package nexora_backend.citizen.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "citizen_notification")
//public class CitizenNotification {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "citizen_id", nullable = false)
//    private Long citizenId;
//
//    @Column(nullable = false, length = 100)
//    private String title;
//
//    @Column(nullable = false, columnDefinition = "TEXT")
//    private String message;
//
//    @Column(nullable = false, length = 30)
//    private String type;
//
//    @Column(name = "is_read")
//    private Boolean isRead = false;
//
//    @Column(name = "related_report_id")
//    private Long relatedReportId;
//
//    @Column(name = "related_task_id")
//    private Long relatedTaskId;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    // ========== GETTERS & SETTERS ==========
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public Long getCitizenId() { return citizenId; }
//    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
//
//    public String getTitle() { return title; }
//    public void setTitle(String title) { this.title = title; }
//
//    public String getMessage() { return message; }
//    public void setMessage(String message) { this.message = message; }
//
//    public String getType() { return type; }
//    public void setType(String type) { this.type = type; }
//
//    public Boolean getIsRead() { return isRead; }
//    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
//
//    public Long getRelatedReportId() { return relatedReportId; }
//    public void setRelatedReportId(Long relatedReportId) { this.relatedReportId = relatedReportId; }
//
//    public Long getRelatedTaskId() { return relatedTaskId; }
//    public void setRelatedTaskId(Long relatedTaskId) { this.relatedTaskId = relatedTaskId; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//
//    // ========== BUILDER ==========
//    public static CitizenNotificationBuilder builder() {
//        return new CitizenNotificationBuilder();
//    }
//
//    public static class CitizenNotificationBuilder {
//        private Long id;
//        private Long citizenId;
//        private String title;
//        private String message;
//        private String type;
//        private Boolean isRead = false;
//        private Long relatedReportId;
//        private Long relatedTaskId;
//        private LocalDateTime createdAt;
//
//        public CitizenNotificationBuilder id(Long id) { this.id = id; return this; }
//        public CitizenNotificationBuilder citizenId(Long citizenId) { this.citizenId = citizenId; return this; }
//        public CitizenNotificationBuilder title(String title) { this.title = title; return this; }
//        public CitizenNotificationBuilder message(String message) { this.message = message; return this; }
//        public CitizenNotificationBuilder type(String type) { this.type = type; return this; }
//        public CitizenNotificationBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
//        public CitizenNotificationBuilder relatedReportId(Long relatedReportId) { this.relatedReportId = relatedReportId; return this; }
//        public CitizenNotificationBuilder relatedTaskId(Long relatedTaskId) { this.relatedTaskId = relatedTaskId; return this; }
//        public CitizenNotificationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
//
//        public CitizenNotification build() {
//            CitizenNotification n = new CitizenNotification();
//            n.id = this.id;
//            n.citizenId = this.citizenId;
//            n.title = this.title;
//            n.message = this.message;
//            n.type = this.type;
//            n.isRead = this.isRead;
//            n.relatedReportId = this.relatedReportId;
//            n.relatedTaskId = this.relatedTaskId;
//            n.createdAt = this.createdAt;
//            return n;
//        }
//    }
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//}