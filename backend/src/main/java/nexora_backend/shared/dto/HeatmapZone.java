package nexora_backend.shared.dto;

public class HeatmapZone {
    private Double latitude;
    private Double longitude;
    private String intensity;
    private Integer reportCount;
    private String area;
    private String city;
    private Double severityScore;

    // Getters
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getIntensity() { return intensity; }
    public Integer getReportCount() { return reportCount; }
    public String getArea() { return area; }
    public String getCity() { return city; }
    public Double getSeverityScore() { return severityScore; }

    // Setters
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setIntensity(String intensity) { this.intensity = intensity; }
    public void setReportCount(Integer reportCount) { this.reportCount = reportCount; }
    public void setArea(String area) { this.area = area; }
    public void setCity(String city) { this.city = city; }
    public void setSeverityScore(Double severityScore) { this.severityScore = severityScore; }

    // Builder
    public static HeatmapZoneBuilder builder() { return new HeatmapZoneBuilder(); }

    public static class HeatmapZoneBuilder {
        private Double latitude;
        private Double longitude;
        private String intensity;
        private Integer reportCount;
        private String area;
        private String city;
        private Double severityScore;

        public HeatmapZoneBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public HeatmapZoneBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public HeatmapZoneBuilder intensity(String intensity) { this.intensity = intensity; return this; }
        public HeatmapZoneBuilder reportCount(Integer reportCount) { this.reportCount = reportCount; return this; }
        public HeatmapZoneBuilder area(String area) { this.area = area; return this; }
        public HeatmapZoneBuilder city(String city) { this.city = city; return this; }
        public HeatmapZoneBuilder severityScore(Double severityScore) { this.severityScore = severityScore; return this; }

        public HeatmapZone build() {
            HeatmapZone zone = new HeatmapZone();
            zone.latitude = this.latitude;
            zone.longitude = this.longitude;
            zone.intensity = this.intensity;
            zone.reportCount = this.reportCount;
            zone.area = this.area;
            zone.city = this.city;
            zone.severityScore = this.severityScore;
            return zone;
        }
    }
}