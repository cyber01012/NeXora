package nexora_backend.assigningofficer.mediator;

import lombok.RequiredArgsConstructor;
import nexora_backend.assigningofficer.dto.DispatchRequest;
import nexora_backend.database.entity.*;
import nexora_backend.database.repository.*;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Concrete mediator coordinating state transitions and link creations between 
 * Reports (Colleagues), Departments (Colleagues), and the dispatch result (ForwardedComplaint).
 */
@Component
@RequiredArgsConstructor
public class DispatchMediatorImpl implements DispatchMediator {

    private final SOSReportRepository sosReportRepository;
    private final CivicReportRepository civicReportRepository;
    private final ForwardedComplaintRepository forwardedComplaintRepository;
    private final DepartmentRepository departmentRepository;
    private final AdminUserRepository adminUserRepository;
    private final org.springframework.context.ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public Map<String, Object> dispatch(String aoUsername, DispatchRequest request) {
        AdminUser ao = adminUserRepository.findByUsername(aoUsername)
                .orElseThrow(() -> new RuntimeException("Assigning Officer not found: " + aoUsername));

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found: " + request.getDepartmentId()));

        ForwardedComplaint complaint = ForwardedComplaint.builder()
                .assigningOfficer(ao)
                .department(dept)
                .submitStatus(true)
                .submitDate(LocalDate.now())
                .submitTime(LocalTime.now())
                .readByDept(false)
                .assignedToWorker(false)
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .remarks(request.getRemarks())
                .build();

        // Link the right report type and update colleague states
        if ("SOS".equalsIgnoreCase(request.getReportType())) {
            SOSReport sos = sosReportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new RuntimeException("SOS Report not found: " + request.getReportId()));
            complaint.setSosId(sos.getSosId());
            // Update SOS status (Colleague state update)
            sos.setStatus("DISPATCHED");
            sosReportRepository.save(sos);
            eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.TaskAssignedEvent(this, "SOS-" + sos.getSosId()));
        } else if ("CIVIC".equalsIgnoreCase(request.getReportType())) {
            CivicReport civic = civicReportRepository.findById(request.getReportId())
                    .orElseThrow(() -> new RuntimeException("Civic Report not found: " + request.getReportId()));
            complaint.setReportId(civic.getCivicId());
            if (civic.getCitizen() != null) {
                complaint.setCitizen(civic.getCitizen());
            }
            // Update civic status (Colleague state update)
            civic.setStatus("DISPATCHED");
            civicReportRepository.save(civic);
            eventPublisher.publishEvent(new nexora_backend.notificationsystem.events.ReportAssignedEvent(this, civic));
        } else {
            throw new RuntimeException("Invalid reportType: " + request.getReportType());
        }

        forwardedComplaintRepository.save(complaint);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("forwardedComplainId", complaint.getForwardedComplainId());
        response.put("departmentName", dept.getDeptName());
        response.put("status", "DISPATCHED");
        return response;
    }
}
