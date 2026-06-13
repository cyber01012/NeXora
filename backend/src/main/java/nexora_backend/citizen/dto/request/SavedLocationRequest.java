package nexora_backend.citizen.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SavedLocationRequest {
    @NotBlank
    private String label;

    @NotBlank
    private String address;

    private Double latitude;
    private Double longitude;
    private Boolean isDefault;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
}