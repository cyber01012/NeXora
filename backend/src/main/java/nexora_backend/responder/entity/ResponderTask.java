//package nexora_backend.responder.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "responder_task")
//public class ResponderTask {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "forwarded_complaint_id", nullable = false)
//    private Long forwardedComplaintId;
//
//    @Column(name = "responder_id", nullable = false, length = 50)
//    private String responderId;
//
//    @Column(nullable = false, length = 100)
//    private String title;
//
//    @Column(columnDefinition = "TEXT")
//    private String description;
//
//    @Column(name = "location_address")
//    private String locationAddress;
//
//    private Double latitude;
//    private Double longitude;
//
//    @Column(length = 20)
//    private String priority = "MEDIUM";
//
//    @Column(length = 30)
//    private String status = "PENDING";
//
//    @Column(name = "accepted_at")
//    private LocalDateTime acceptedAt;
//
//    @Column(name = "completed_at")
//    private LocalDateTime completedAt;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//        if (status == null) status = "PENDING";
//        if (priority == null) priority = "MEDIUM";
//    }
//
//    // Getters and Setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public Long getForwardedComplaintId() { return forwardedComplaintId; }
//    public void setForwardedComplaintId(Long forwardedComplaintId) { this.forwardedComplaintId = forwardedComplaintId; }
//
//    public String getResponderId() { return responderId; }
//    public void setResponderId(String responderId) { this.responderId = responderId; }
//
//    public String getTitle() { return title; }
//    public void setTitle(String title) { this.title = title; }
//
//    public String getDescription() { return description; }
//    public void setDescription(String description) { this.description = description; }
//
//    public String getLocationAddress() { return locationAddress; }
//    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }
//
//    public Double getLatitude() { return latitude; }
//    public void setLatitude(Double latitude) { this.latitude = latitude; }
//
//    public Double getLongitude() { return longitude; }
//    public void setLongitude(Double longitude) { this.longitude = longitude; }
//
//    public String getPriority() { return priority; }
//    public void setPriority(String priority) { this.priority = priority; }
//
//    public String getStatus() { return status; }
//    public void setStatus(String status) { this.status = status; }
//
//    public LocalDateTime getAcceptedAt() { return acceptedAt; }
//    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
//
//    public LocalDateTime getCompletedAt() { return completedAt; }
//    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//
//    // Builder Pattern
//    public static ResponderTaskBuilder builder() { return new ResponderTaskBuilder(); }
//
//    public static class ResponderTaskBuilder {
//        private Long id;
//        private Long forwardedComplaintId;
//        private String responderId;
//        private String title;
//        private String description;
//        private String locationAddress;
//        private Double latitude;
//        private Double longitude;
//        private String priority = "MEDIUM";
//        private String status = "PENDING";
//        private LocalDateTime acceptedAt;
//        private LocalDateTime completedAt;
//        private LocalDateTime createdAt;
//
//        public ResponderTaskBuilder id(Long id) { this.id = id; return this; }
//        public ResponderTaskBuilder forwardedComplaintId(Long forwardedComplaintId) { this.forwardedComplaintId = forwardedComplaintId; return this; }
//        public ResponderTaskBuilder responderId(String responderId) { this.responderId = responderId; return this; }
//        public ResponderTaskBuilder title(String title) { this.title = title; return this; }
//        public ResponderTaskBuilder description(String description) { this.description = description; return this; }
//        public ResponderTaskBuilder locationAddress(String locationAddress) { this.locationAddress = locationAddress; return this; }
//        public ResponderTaskBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
//        public ResponderTaskBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
//        public ResponderTaskBuilder priority(String priority) { this.priority = priority; return this; }
//        public ResponderTaskBuilder status(String status) { this.status = status; return this; }
//        public ResponderTaskBuilder acceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; return this; }
//        public ResponderTaskBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
//        public ResponderTaskBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
//
//        public ResponderTask build() {
//            ResponderTask task = new ResponderTask();
//            task.id = this.id;
//            task.forwardedComplaintId = this.forwardedComplaintId;
//            task.responderId = this.responderId;
//            task.title = this.title;
//            task.description = this.description;
//            task.locationAddress = this.locationAddress;
//            task.latitude = this.latitude;
//            task.longitude = this.longitude;
//            task.priority = this.priority;
//            task.status = this.status;
//            task.acceptedAt = this.acceptedAt;
//            task.completedAt = this.completedAt;
//            task.createdAt = this.createdAt;
//            return task;
//        }
//    }
//}