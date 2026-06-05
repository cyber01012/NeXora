package nexora_backend.citizen.dto.response;

import java.time.LocalDateTime;

public class ReportResponse {

    private Long id;
    private String type;
    private String description;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private String mediaPath;
    private String priority;
    private String status;
    private String trackingCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Manual getters
    public Long getId() { return id; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getLocationAddress() { return locationAddress; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getMediaPath() { return mediaPath; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public String getTrackingCode() { return trackingCode; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Manual Builder
    public static ReportResponseBuilder builder() {
        return new ReportResponseBuilder();
    }

    public static class ReportResponseBuilder {
        private Long id;
        private String type;
        private String description;
        private String locationAddress;
        private Double latitude;
        private Double longitude;
        private String mediaPath;
        private String priority;
        private String status;
        private String trackingCode;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ReportResponseBuilder id(Long id) { this.id = id; return this; }
        public ReportResponseBuilder type(String type) { this.type = type; return this; }
        public ReportResponseBuilder description(String description) { this.description = description; return this; }
        public ReportResponseBuilder locationAddress(String locationAddress) { this.locationAddress = locationAddress; return this; }
        public ReportResponseBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ReportResponseBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public ReportResponseBuilder mediaPath(String mediaPath) { this.mediaPath = mediaPath; return this; }
        public ReportResponseBuilder priority(String priority) { this.priority = priority; return this; }
        public ReportResponseBuilder status(String status) { this.status = status; return this; }
        public ReportResponseBuilder trackingCode(String trackingCode) { this.trackingCode = trackingCode; return this; }
        public ReportResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ReportResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ReportResponse build() {
            ReportResponse r = new ReportResponse();
            r.id = this.id;
            r.type = this.type;
            r.description = this.description;
            r.locationAddress = this.locationAddress;
            r.latitude = this.latitude;
            r.longitude = this.longitude;
            r.mediaPath = this.mediaPath;
            r.priority = this.priority;
            r.status = this.status;
            r.trackingCode = this.trackingCode;
            r.createdAt = this.createdAt;
            r.updatedAt = this.updatedAt;
            return r;
        }
    }
}