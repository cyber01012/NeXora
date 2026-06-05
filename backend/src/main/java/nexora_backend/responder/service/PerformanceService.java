package nexora_backend.responder.service;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.repository.AdminUserRepository;
import nexora_backend.database.repository.ForwardedComplaintRepository;
import nexora_backend.independent.entity.ResponderPerformance;
import nexora_backend.responder.dto.response.PerformanceResponse;
import nexora_backend.responder.repository.ResponderPerformanceRepository;
import nexora_backend.shared.exception.BusinessException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class PerformanceService {

    private final ForwardedComplaintRepository complaintRepository;
    private final AdminUserRepository adminUserRepository;
    private final ResponderPerformanceRepository performanceRepository;

    public PerformanceService(ForwardedComplaintRepository complaintRepository,
                              AdminUserRepository adminUserRepository,
                              ResponderPerformanceRepository performanceRepository) {
        this.complaintRepository = complaintRepository;
        this.adminUserRepository = adminUserRepository;
        this.performanceRepository = performanceRepository;
    }

    public PerformanceResponse getPerformance(String username) {
        AdminUser responder = adminUserRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException("Responder not found"));

        String performanceId = responder.getDepartment() != null ?
                String.valueOf(responder.getDepartment().getDeptId()) : username;

        ResponderPerformance performance = performanceRepository.findByResponderId(performanceId)
                .orElse(null);

        PerformanceResponse response = new PerformanceResponse();
        response.setResponderId(username);

        if (performance != null) {
            response.setTotalTasks(performance.getTotalTasks());
            response.setCompletedTasks(performance.getCompletedTasks());
            response.setRejectedTasks(performance.getRejectedTasks());
            response.setRating(performance.getRating());
            response.setAvgResponseTimeMinutes(performance.getAvgResponseTimeMinutes());
            response.setAvgCompletionTimeHours(performance.getAvgCompletionTimeHours());
            response.setLastUpdated(performance.getLastUpdated());
        } else {
            response.setTotalTasks(0);
            response.setCompletedTasks(0);
            response.setRejectedTasks(0);
            response.setRating(BigDecimal.ZERO);
            response.setAvgResponseTimeMinutes(BigDecimal.ZERO);
            response.setAvgCompletionTimeHours(BigDecimal.ZERO);
        }

        return response;
    }
}