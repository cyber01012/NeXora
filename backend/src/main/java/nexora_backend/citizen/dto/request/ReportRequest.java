package nexora_backend.citizen.dto.request;

import lombok.Data;

@Data
public class ReportRequest {
    private String type;
    private String description;
    private String locationAddress;
    private Double latitude;
    private Double longitude;
    private String mediaPath;
    private String priority;
    private Integer natureId;
    private String province;
    private String district;
    private String town;
    private String area;
    private String city;
}