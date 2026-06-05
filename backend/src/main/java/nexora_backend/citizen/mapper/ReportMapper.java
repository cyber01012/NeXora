// ============================================
// FILE: nexora_backend/citizen/mapper/ReportMapper.java
// ============================================
package nexora_backend.citizen.mapper;

import nexora_backend.citizen.dto.response.ReportResponse;
import nexora_backend.database.entity.CivicReport;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ReportMapper {

    public ReportResponse toResponse(CivicReport entity) {
        if (entity == null) return null;

        Integer natureId = entity.getComplaintNature() != null ? entity.getComplaintNature().getId() : null;
        String typeName = getTypeNameFromNatureId(natureId);

        return ReportResponse.builder()
                .id(entity.getCivicId())
                .type(typeName)
                .description(entity.getDetail())
                .locationAddress(entity.getArea() + ", " + entity.getCity())
                .status("PENDING")
                .trackingCode("CIV-" + entity.getCivicId())
                .createdAt(null) // CivicReport has no createdAt field, set null or add field
                .build();
    }

    private String getTypeNameFromNatureId(Integer natureId) {
        if (natureId == null) return "OTHER";
        Map<Integer, String> map = new HashMap<>();
        map.put(7, "ELECTRICITY");
        map.put(8, "GAS");
        map.put(9, "ROAD");
        map.put(10, "WATER");
        map.put(1, "MEDICAL");
        return map.getOrDefault(natureId, "OTHER");
    }
}