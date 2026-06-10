package nexora_backend.citizen.dto.response;

import java.time.LocalDateTime;

public class ReportStatusResponse {

    private Long id;
    private String trackingCode;
    private String status;
    private String type;
    private String locationAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public String getTrackingCode() { return trackingCode; }
    public String getStatus() { return status; }
    public String getType() { return type; }
    public String getLocationAddress() { return locationAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public static ReportStatusResponseBuilder builder() { return new ReportStatusResponseBuilder(); }

    public static class ReportStatusResponseBuilder {
        private Long id;
        private String trackingCode;
        private String status;
        private String type;
        private String locationAddress;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ReportStatusResponseBuilder id(Long id) { this.id = id; return this; }
        public ReportStatusResponseBuilder trackingCode(String trackingCode) { this.trackingCode = trackingCode; return this; }
        public ReportStatusResponseBuilder status(String status) { this.status = status; return this; }
        public ReportStatusResponseBuilder type(String type) { this.type = type; return this; }
        public ReportStatusResponseBuilder locationAddress(String locationAddress) { this.locationAddress = locationAddress; return this; }
        public ReportStatusResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ReportStatusResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ReportStatusResponse build() {
            ReportStatusResponse r = new ReportStatusResponse();
            r.id = this.id;
            r.trackingCode = this.trackingCode;
            r.status = this.status;
            r.type = this.type;
            r.locationAddress = this.locationAddress;
            r.createdAt = this.createdAt;
            r.updatedAt = this.updatedAt;
            return r;
        }
    }
}