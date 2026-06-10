package nexora_backend.citizen.service;

import nexora_backend.citizen.dto.request.ReportRequest;
import nexora_backend.database.entity.CivicReport;
import nexora_backend.database.entity.ComplaintNature;
import nexora_backend.database.entity.ComplaintType;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.repository.CivicReportRepository;
import nexora_backend.database.repository.ComplaintNatureRepository;
import nexora_backend.database.repository.ComplaintTypeRepository;
import nexora_backend.database.repository.RegisterCitizenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CivicReportRepository reportRepository;
    private final ComplaintNatureRepository complaintNatureRepository;
    private final ComplaintTypeRepository complaintTypeRepository;
    private final RegisterCitizenRepository registerCitizenRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    public ReportService(CivicReportRepository reportRepository,
                         ComplaintNatureRepository complaintNatureRepository,
                         ComplaintTypeRepository complaintTypeRepository,
                         RegisterCitizenRepository registerCitizenRepository,
                         org.springframework.context.ApplicationEventPublisher eventPublisher) {
        this.reportRepository = reportRepository;
        this.complaintNatureRepository = complaintNatureRepository;
        this.complaintTypeRepository = complaintTypeRepository;
        this.registerCitizenRepository = registerCitizenRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public CivicReport createReport(Long citizenId, ReportRequest request) {
        // ✅ Fetch managed entities from DB to avoid TransientObjectException
        RegisterCitizen citizen = registerCitizenRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found: " + citizenId));

        // Civic type is always ID=2
        ComplaintType type = complaintTypeRepository.findById(2)
                .orElseThrow(() -> new RuntimeException("ComplaintType 2 (CIVIC) not found in DB"));

        Integer natureId = getNatureIdFromType(request.getType());
        ComplaintNature nature = complaintNatureRepository.findById(natureId.longValue())
                .orElseThrow(() -> new RuntimeException("ComplaintNature not found for type: " + request.getType()));

        CivicReport report = new CivicReport();
        report.setCitizen(citizen);
        report.setComplaintType(type);
        report.setComplaintNature(nature);
        report.setDetail(request.getDescription());
        report.setProvince(request.getProvince());
        report.setDistrict(request.getDistrict());
        report.setTown(request.getTown());
        report.setArea(request.getArea());
        report.setCity(request.getCity());
        report.setEvidence(request.getMediaPath());
        report.setStatus("PENDING_ADMIN");

        CivicReport savedReport = reportRepository.save(report);

        eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.ReportSubmittedEvent(this, savedReport));

        return savedReport;
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