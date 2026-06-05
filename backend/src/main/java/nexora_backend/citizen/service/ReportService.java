// ============================================
// FILE: nexora_backend/citizen/service/ReportService.java
// ============================================
package nexora_backend.citizen.service;

import nexora_backend.citizen.dto.request.ReportRequest;
import nexora_backend.database.entity.CivicReport;
import nexora_backend.database.entity.ComplaintNature;
import nexora_backend.database.entity.ComplaintType;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.repository.CivicReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CivicReportRepository reportRepository;

    public ReportService(CivicReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @Transactional
    public CivicReport createReport(Long citizenId, ReportRequest request) {
        RegisterCitizen citizen = new RegisterCitizen();
        citizen.setId(citizenId);

        ComplaintType type = new ComplaintType();
        type.setId(2); // 2 = CIVIC

        ComplaintNature nature = new ComplaintNature();
        nature.setId(getNatureIdFromType(request.getType()));

        CivicReport entity = new CivicReport();
        entity.setCitizen(citizen);
        entity.setDetail(request.getDescription());
        entity.setComplaintType(type);
        entity.setComplaintNature(nature);
        entity.setProvince(request.getProvince());
        entity.setDistrict(request.getDistrict());
        entity.setTown(request.getTown());
        entity.setArea(request.getArea());
        entity.setCity(request.getCity());
        entity.setEvidence(request.getMediaPath());

        return reportRepository.save(entity);
    }

    public List<CivicReport> getMyReports(Long citizenId, String statusFilter) {
        return reportRepository.findByCitizen_IdOrderByCivicIdDesc(citizenId);
    }

    public Map<String, Object> getStats(Long citizenId) {
        List<CivicReport> all = reportRepository.findByCitizen_IdOrderByCivicIdDesc(citizenId);
        Map<String, Long> byType = new HashMap<>();

        Map<Integer, String> natureToName = new HashMap<>();
        natureToName.put(7, "ELECTRICITY");
        natureToName.put(8, "GAS");
        natureToName.put(9, "ROAD");
        natureToName.put(10, "WATER");
        natureToName.put(1, "MEDICAL");

        for (CivicReport r : all) {
            String typeName = "OTHER";
            if (r.getComplaintNature() != null && r.getComplaintNature().getId() != null) {
                typeName = natureToName.getOrDefault(r.getComplaintNature().getId(), "OTHER");
            }
            byType.merge(typeName, 1L, Long::sum);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReports", all.size());
        stats.put("byType", byType);
        return stats;
    }

    private Integer getNatureIdFromType(String type) {
        Map<String, Integer> typeToNature = new HashMap<>();
        typeToNature.put("ELECTRICITY", 7);
        typeToNature.put("GAS", 8);
        typeToNature.put("ROAD", 9);
        typeToNature.put("WATER", 10);
        typeToNature.put("MEDICAL", 1);
        if (type == null) return 7;
        return typeToNature.getOrDefault(type.toUpperCase(), 7);
    }
}