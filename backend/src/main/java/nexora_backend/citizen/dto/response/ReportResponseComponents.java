package nexora_backend.citizen.dto.response;

import java.time.LocalDateTime;

public class ReportResponseComponents {

    public static ReportResponse createBasicInfo(
            Long id,
            String type,
            String description,
            String status) {
        ReportResponse r = new ReportResponse();
        r.setId(id);
        r.setType(type);
        r.setDescription(description);
        r.setStatus(status);
        return r;
    }
    public static void setLocation(
            ReportResponse response,
            String locationAddress,
            String city,
            String area,
            String district,
            String province) {
        response.setLocationAddress(locationAddress);
        // response.setCity(city);
        // response.setArea(area);
    }
    public static void setMedia(
            ReportResponse response,
            String mediaPath,
            Double latitude,
            Double longitude) {
        response.setMediaPath(mediaPath);
        response.setLatitude(latitude);
        response.setLongitude(longitude);
    }

    public static void setMetadata(
            ReportResponse response,
            String trackingCode,
            String priority,
            LocalDateTime createdAt) {
        response.setTrackingCode(trackingCode);
        response.setPriority(priority);
        response.setCreatedAt(createdAt);
    }
}