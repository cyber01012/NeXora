package nexora_backend.citizen.mapper;

import nexora_backend.citizen.dto.response.ReportResponse;
import nexora_backend.citizen.dto.response.ReportResponseComponents;
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

        ReportResponse response = ReportResponseComponents.createBasicInfo(
                entity.getCivicId(),
                typeName,
                entity.getDetail(),
                "PENDING"
        );

        ReportResponseComponents.setLocation(
                response,
                entity.getArea() + ", " + entity.getCity(),
                entity.getCity(),
                entity.getArea(),
                entity.getDistrict(),
                entity.getProvince()
        );
        ReportResponseComponents.setMedia(
                response,
                entity.getEvidence(),
                null,
                null
        );

        ReportResponseComponents.setMetadata(
                response,
                "CIV-" + entity.getCivicId(),
                "MEDIUM",
                null // CivicReport has no createdAt field
        );

        return response;
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