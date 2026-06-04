package nexora_backend.citizen.service;

import nexora_backend.citizen.dto.request.ReportRequest;
import nexora_backend.citizen.entity.CitizenReport;
import nexora_backend.citizen.repository.CitizenReportRepository;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final CitizenReportRepository reportRepository;
    private final CitizenNotificationService notificationService;

    public ReportService(CitizenReportRepository reportRepository,
                         CitizenNotificationService notificationService) {
        this.reportRepository = reportRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public CitizenReport createReport(Long citizenId, ReportRequest request) {
        CitizenReport entity = CitizenReport.builder()
                .citizenId(citizenId)
                .detail(request.getDescription())
                .natureId(getNatureIdFromType(request.getType()))
                .province(request.getProvince())
                .district(request.getDistrict())
                .town(request.getTown())
                .area(request.getArea())
                .city(request.getCity())
                .evidence(request.getMediaPath())
                .status("PENDING_ADMIN")
                .build();

        CitizenReport saved = reportRepository.save(entity);
        notificationService.notifyReportSubmitted(citizenId, "CIV-" + saved.getCivicId());
        return saved;
    }

    public List<CitizenReport> getMyReports(Long citizenId, String statusFilter) {
        return reportRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
    }

    public Map<String, Long> getStats(Long citizenId) {
        List<CitizenReport> all = reportRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
        Map<String, Long> byType = new HashMap<>();

        Map<Integer, String> natureToName = new HashMap<>();
        natureToName.put(7, "ELECTRICITY");
        natureToName.put(8, "GAS");
        natureToName.put(9, "ROAD");
        natureToName.put(10, "WATER");
        natureToName.put(1, "MEDICAL");

        for (CitizenReport r : all) {
            String typeName = natureToName.getOrDefault(r.getNatureId(), "OTHER");
            byType.merge(typeName, 1L, Long::sum);
        }
        return byType;
    }

    private Integer getNatureIdFromType(String type) {
        Map<String, Integer> typeToNature = new HashMap<>();
        typeToNature.put("ELECTRICITY", 7);
        typeToNature.put("GAS", 8);
        typeToNature.put("ROAD", 9);
        typeToNature.put("WATER", 10);
        typeToNature.put("MEDICAL", 1);
        return typeToNature.getOrDefault(type, 7);
    }
}