package nexora_backend.insight.store;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import nexora_backend.insight.model.*;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
public class MockDataStore {

  
    private Map<String, PowerSchedule> powerSchedules;
    private Map<String, RegionCoords> regionCoords;
   

    // ObjectMapper with JavaTimeModule for LocalDate support
    private final ObjectMapper objectMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule());

    @PostConstruct
    public void init() {
       
        loadPowerSchedules();
        loadRegionCoords();
       
    }

   
    

    private void loadPowerSchedules() {
        try {
            InputStream inputStream = new ClassPathResource("mock-data/power-schedules.json").getInputStream();
            powerSchedules = objectMapper.readValue(inputStream, 
                new TypeReference<Map<String, PowerSchedule>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Failed to load power-schedules.json", e);
        }
    }

    private void loadRegionCoords() {
        try {
            InputStream inputStream = new ClassPathResource("mock-data/region-coords.json").getInputStream();
            regionCoords = objectMapper.readValue(inputStream, 
                new TypeReference<Map<String, RegionCoords>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Failed to load region-coords.json", e);
        }
    }

   
    

   
    public PowerSchedule getPowerSchedule(String region) {
        return powerSchedules.getOrDefault(region,
            new PowerSchedule(List.of("9:00 PM - 11:00 PM")));
    }

    public RegionCoords getRegionCoords(String region) {
        return regionCoords.getOrDefault(region,
            new RegionCoords(24.86, 67.01));
    }

    

    public List<String> getAllRegions() {
        return List.copyOf(regionCoords.keySet());
    }
}