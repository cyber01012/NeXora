package nexora_backend.citizen.dto.response;

import java.time.LocalDateTime;

public class SavedLocationResponse {

    private Long id;
    private String label;
    private String address;
    private Double latitude;
    private Double longitude;
    private Boolean isDefault;
    private LocalDateTime createdAt;

    // Getters
    public Long getId() { return id; }
    public String getLabel() { return label; }
    public String getAddress() { return address; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Boolean getIsDefault() { return isDefault; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Builder
    public static SavedLocationResponseBuilder builder() { return new SavedLocationResponseBuilder(); }

    public static class SavedLocationResponseBuilder {
        private Long id;
        private String label;
        private String address;
        private Double latitude;
        private Double longitude;
        private Boolean isDefault;
        private LocalDateTime createdAt;

        public SavedLocationResponseBuilder id(Long id) { this.id = id; return this; }
        public SavedLocationResponseBuilder label(String label) { this.label = label; return this; }
        public SavedLocationResponseBuilder address(String address) { this.address = address; return this; }
        public SavedLocationResponseBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public SavedLocationResponseBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public SavedLocationResponseBuilder isDefault(Boolean isDefault) { this.isDefault = isDefault; return this; }
        public SavedLocationResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SavedLocationResponse build() {
            SavedLocationResponse r = new SavedLocationResponse();
            r.id = this.id;
            r.label = this.label;
            r.address = this.address;
            r.latitude = this.latitude;
            r.longitude = this.longitude;
            r.isDefault = this.isDefault;
            r.createdAt = this.createdAt;
            return r;
        }
    }
}