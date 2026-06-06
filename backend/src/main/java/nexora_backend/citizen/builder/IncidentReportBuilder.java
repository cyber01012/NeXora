//// ============================================
//// FILE: nexora_backend/citizen/builder/IncidentReportBuilder.java
//// ============================================
//package nexora_backend.citizen.builder;
//
//public class IncidentReportBuilder {
//
//    String type;
//    String detail;
//    String province;
//    String district;
//    String town;
//    String area;
//    String city;
//    Double latitude;
//    Double longitude;
//    String evidencePath;
//    String priority = "MEDIUM";
//
//    public IncidentReportBuilder withType(String type) { this.type = type; return this; }
//    public IncidentReportBuilder withDetail(String detail) { this.detail = detail; return this; }
//    public IncidentReportBuilder withDescription(String description) { this.detail = description; return this; }
//    public IncidentReportBuilder withLocation(String location) { this.city = location; return this; }
//    public IncidentReportBuilder withMediaPath(String mediaPath) { this.evidencePath = mediaPath; return this; }
//    public IncidentReportBuilder withPriority(String priority) { this.priority = priority; return this; }
//    public IncidentReportBuilder withProvince(String province) { this.province = province; return this; }
//    public IncidentReportBuilder withDistrict(String district) { this.district = district; return this; }
//    public IncidentReportBuilder withTown(String town) { this.town = town; return this; }
//    public IncidentReportBuilder withArea(String area) { this.area = area; return this; }
//    public IncidentReportBuilder withCity(String city) { this.city = city; return this; }
//    public IncidentReportBuilder withLatitude(Double latitude) { this.latitude = latitude; return this; }
//    public IncidentReportBuilder withLongitude(Double longitude) { this.longitude = longitude; return this; }
//    public IncidentReportBuilder withEvidencePath(String evidencePath) { this.evidencePath = evidencePath; return this; }
//
//    public IncidentReport build() {
//        if (this.type == null || this.detail == null) {
//            throw new IllegalArgumentException("Type and detail are required");
//        }
//        return new IncidentReport(this);
//    }
//}