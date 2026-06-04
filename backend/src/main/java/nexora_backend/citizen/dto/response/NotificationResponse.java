package nexora_backend.citizen.dto.response;

import java.time.LocalDateTime;

public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private Long relatedTaskId;
    private LocalDateTime createdAt;

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getType() { return type; }
    public Boolean getIsRead() { return isRead; }
    public Long getRelatedTaskId() { return relatedTaskId; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Builder
    public static NotificationResponseBuilder builder() { return new NotificationResponseBuilder(); }

    public static class NotificationResponseBuilder {
        private Long id;
        private String title;
        private String message;
        private String type;
        private Boolean isRead;
        private Long relatedTaskId;
        private LocalDateTime createdAt;

        public NotificationResponseBuilder id(Long id) { this.id = id; return this; }
        public NotificationResponseBuilder title(String title) { this.title = title; return this; }
        public NotificationResponseBuilder message(String message) { this.message = message; return this; }
        public NotificationResponseBuilder type(String type) { this.type = type; return this; }
        public NotificationResponseBuilder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public NotificationResponseBuilder relatedTaskId(Long relatedTaskId) { this.relatedTaskId = relatedTaskId; return this; }
        public NotificationResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationResponse build() {
            NotificationResponse r = new NotificationResponse();
            r.id = this.id;
            r.title = this.title;
            r.message = this.message;
            r.type = this.type;
            r.isRead = this.isRead;
            r.relatedTaskId = this.relatedTaskId;
            r.createdAt = this.createdAt;
            return r;
        }
    }
}