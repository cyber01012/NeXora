package nexora_backend.citizen.dto.response;

public class DisasterZoneResponse {

    private String name;
    private String severity;
    private double latitude;
    private double longitude;
    private double radiusKm;
    private String color;

    // Getters
    public String getName() { return name; }
    public String getSeverity() { return severity; }
    public double getLatitude() { return latitude; }
    public double getLongitude() { return longitude; }
    public double getRadiusKm() { return radiusKm; }
    public String getColor() { return color; }

    // Builder
    public static DisasterZoneResponseBuilder builder() { return new DisasterZoneResponseBuilder(); }

    public static class DisasterZoneResponseBuilder {
        private String name;
        private String severity;
        private double latitude;
        private double longitude;
        private double radiusKm;
        private String color;

        public DisasterZoneResponseBuilder name(String name) { this.name = name; return this; }
        public DisasterZoneResponseBuilder severity(String severity) { this.severity = severity; return this; }
        public DisasterZoneResponseBuilder latitude(double latitude) { this.latitude = latitude; return this; }
        public DisasterZoneResponseBuilder longitude(double longitude) { this.longitude = longitude; return this; }
        public DisasterZoneResponseBuilder radiusKm(double radiusKm) { this.radiusKm = radiusKm; return this; }
        public DisasterZoneResponseBuilder color(String color) { this.color = color; return this; }

        public DisasterZoneResponse build() {
            DisasterZoneResponse r = new DisasterZoneResponse();
            r.name = this.name;
            r.severity = this.severity;
            r.latitude = this.latitude;
            r.longitude = this.longitude;
            r.radiusKm = this.radiusKm;
            r.color = this.color;
            return r;
        }
    }
}