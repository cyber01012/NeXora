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

    // ✅ Simple constructor
    public ReportResponse() {}

    // ✅ Simple setters (no chaining)
    public void setId(Long id) { this.id = id; }
    public void setType(String type) { this.type = type; }
    public void setDescription(String description) { this.description = description; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setMediaPath(String mediaPath) { this.mediaPath = mediaPath; }
    public void setPriority(String priority) { this.priority = priority; }
    public void setStatus(String status) { this.status = status; }
    public void setTrackingCode(String trackingCode) { this.trackingCode = trackingCode; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // ✅ Getters
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

    // ❌ DELETE: No builder() method
    // ❌ DELETE: No ReportResponseBuilder inner class
}