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
}