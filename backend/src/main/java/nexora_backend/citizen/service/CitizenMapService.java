package nexora_backend.citizen.service;

import nexora_backend.citizen.dto.response.DisasterZoneResponse;
import nexora_backend.shared.map.MapService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CitizenMapService {

    private final MapService mapService;

    // Manual constructor
    public CitizenMapService(MapService mapService) {
        this.mapService = mapService;
    }

    public List<DisasterZoneResponse> getDisasterZones() {
        return Arrays.asList(
                DisasterZoneResponse.builder().name("Korangi Flood Zone").severity("HIGH")
                        .latitude(24.8267).longitude(67.1460).radiusKm(2.5).color("#ef4444").build(),
                DisasterZoneResponse.builder().name("Clifton Power Outage").severity("MEDIUM")
                        .latitude(24.8138).longitude(67.0299).radiusKm(1.2).color("#f59e0b").build()
        );
    }

    public Map<String, Object> getMapConfigForCitizen(Long citizenId) {
        return mapService.showLocation(24.8607, 67.0011, "Karachi");
    }
}