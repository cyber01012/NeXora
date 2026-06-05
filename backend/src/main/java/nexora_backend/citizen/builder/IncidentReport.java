// ============================================
// FILE: nexora_backend/citizen/builder/IncidentReport.java
// ============================================
package nexora_backend.citizen.builder;

import java.time.LocalDateTime;

public class IncidentReport {

    private final String type;
    private final String detail;
    private final String province;
    private final String district;
    private final String town;
    private final String area;
    private final String city;
    private final Double latitude;
    private final Double longitude;
    private final String evidencePath;
    private final String priority;
    private final LocalDateTime submissionTime;

    // Constructor (package-private)
    IncidentReport(IncidentReportBuilder builder) {
        this.type = builder.type;
        this.detail = builder.detail;
        this.province = builder.province;
        this.district = builder.district;
        this.town = builder.town;
        this.area = builder.area;
        this.city = builder.city;
        this.latitude = builder.latitude;
        this.longitude = builder.longitude;
        this.evidencePath = builder.evidencePath;
        this.priority = builder.priority != null ? builder.priority : "MEDIUM";
        this.submissionTime = LocalDateTime.now();
    }

    // ========== GETTERS ==========
    public String getType() { return type; }
    public String getDetail() { return detail; }
    public String getProvince() { return province; }
    public String getDistrict() { return district; }
    public String getTown() { return town; }
    public String getArea() { return area; }
    public String getCity() { return city; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getEvidencePath() { return evidencePath; }
    public String getPriority() { return priority; }
    public LocalDateTime getSubmissionTime() { return submissionTime; }

    // Alias getters
    public String getDescription() { return detail; }
    public String getLocationAddress() { return city; }
    public String getMediaPath() { return evidencePath; }
}