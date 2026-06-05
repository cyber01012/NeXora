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

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocationAddress() { return locationAddress; }
    public void setLocationAddress(String locationAddress) { this.locationAddress = locationAddress; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getMediaPath() { return mediaPath; }
    public void setMediaPath(String mediaPath) { this.mediaPath = mediaPath; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public Integer getNatureId() { return natureId; }
    public void setNatureId(Integer natureId) { this.natureId = natureId; }
    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getTown() { return town; }
    public void setTown(String town) { this.town = town; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
}