package nexora_backend.assigningofficer.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.assigningofficer.dto.DepartmentRequest;
import nexora_backend.assigningofficer.dto.DispatchRequest;
import nexora_backend.database.entity.*;
import nexora_backend.database.enums.Decision;
import nexora_backend.database.repository.*;
import nexora_backend.assigningofficer.mediator.DispatchMediator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssigningOfficerService {

    private final SOSReportRepository sosReportRepository;
    private final CivicReportRepository civicReportRepository;
    private final ForwardedComplaintRepository forwardedComplaintRepository;
    private final DepartmentRepository departmentRepository;
    private final AdminUserRepository adminUserRepository;
    private final ResponderTypeRepository responderTypeRepository;
    private final DispatchMediator dispatchMediator;

    // ========== DASHBOARD ==========

    public Map<String, Object> getDashboard(String aoUsername) {
        Map<String, Object> data = new LinkedHashMap<>();

        long pendingSOS = sosReportRepository.countByStatus("PENDING");
        long pendingCivic = civicReportRepository.countByStatus("PENDING_ADMIN");
        long totalDispatched = forwardedComplaintRepository.countByAssigningOfficer_Username(aoUsername);
        long activeDepartments = departmentRepository.findByActiveTrue().size();

        // Completed = workerDecision = 'D'
        long completed = forwardedComplaintRepository
                .findByAssigningOfficer_UsernameAndWorkerDecision(aoUsername, Decision.D).size();

        data.put("pendingSOS", pendingSOS);
        data.put("pendingCivic", pendingCivic);
        data.put("totalPending", pendingSOS + pendingCivic);
        data.put("totalDispatched", totalDispatched);
        data.put("activeDispatched", totalDispatched - completed);
        data.put("completed", completed);
        data.put("activeDepartments", activeDepartments);

        return data;
    }

    // ========== PENDING REPORTS ==========

    public List<Map<String, Object>> getPendingReports() {
        List<Map<String, Object>> result = new ArrayList<>();

        // Pending SOS
        List<SOSReport> sosList = sosReportRepository.findByStatusOrderBySosIdDesc("PENDING");
        for (SOSReport sos : sosList) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("reportType", "SOS");
            item.put("reportId", sos.getSosId());
            item.put("name", sos.getName());
            item.put("phone", sos.getPhoneAutoDetect());
            item.put("province", sos.getProvince());
            item.put("district", sos.getDistrict());
            item.put("town", sos.getTown());
            item.put("area", sos.getArea());
            item.put("city", sos.getCity());
            item.put("detail", sos.getDetail());
            item.put("priority", sos.getPriority() != null ? sos.getPriority() : "HIGH");
            item.put("nature", sos.getComplaintNature() != null ? sos.getComplaintNature().getDescription() : null);
            item.put("status", sos.getStatus());
            result.add(item);
        }

        // Pending Civic Reports
        List<CivicReport> civicList = civicReportRepository.findByStatusOrderByCivicIdDesc("PENDING_ADMIN");
        for (CivicReport civic : civicList) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("reportType", "CIVIC");
            item.put("reportId", civic.getCivicId());
            item.put("name", civic.getCitizen() != null ? civic.getCitizen().getFullName() : "Unknown");
            item.put("phone", civic.getCitizen() != null ? civic.getCitizen().getPhoneNumber() : null);
            item.put("province", civic.getProvince());
            item.put("district", civic.getDistrict());
            item.put("town", civic.getTown());
            item.put("area", civic.getArea());
            item.put("city", civic.getCity());
            item.put("detail", civic.getDetail());
            item.put("priority", "MEDIUM");
            item.put("nature", civic.getComplaintNature() != null ? civic.getComplaintNature().getDescription() : null);
            item.put("status", civic.getStatus());
            result.add(item);
        }

        return result;
    }
    
    // ========== DISPATCH ==========

//    public Map<String, Object> dispatch(String aoUsername, DispatchRequest request) {
//        return dispatchMediator.dispatch(aoUsername, request);
//    }

    public Map<String, Object> dispatch(String aoUsername, DispatchRequest request) {
        Map<String, Object> result = dispatchMediator.dispatch(aoUsername, request);

        // ✅ UPDATE PARENT STATUS so citizen/helpdesk can track
        if ("CIVIC".equalsIgnoreCase(request.getReportType())) {
            civicReportRepository.findById(request.getReportId()).ifPresent(report -> {
                report.setStatus("ASSIGNED");
                civicReportRepository.save(report);
            });
        } else if ("SOS".equalsIgnoreCase(request.getReportType())) {
            sosReportRepository.findById(request.getReportId()).ifPresent(sos -> {
                sos.setStatus("DISPATCHED");
                sosReportRepository.save(sos);
            });
        }

        return result;
    }

    // ========== FORWARDED TRACKER ==========

    public List<Map<String, Object>> getForwardedComplaints(String aoUsername) {
        List<ForwardedComplaint> list = forwardedComplaintRepository
                .findByAssigningOfficer_UsernameOrderBySubmitDateDesc(aoUsername);
        return list.stream().map(this::toTrackerResponse).collect(Collectors.toList());
    }

    // ========== HISTORY (Completed + Rejected) ==========

    public List<Map<String, Object>> getHistory(String aoUsername) {
        List<ForwardedComplaint> all = forwardedComplaintRepository
                .findByAssigningOfficer_UsernameOrderBySubmitDateDesc(aoUsername);

        // Filter to only completed (workerDecision = D) or rejected (deptDecision = R)
        List<ForwardedComplaint> history = all.stream()
                .filter(c -> c.getWorkerDecision() == Decision.D || c.getDeptDecision() == Decision.R)
                .collect(Collectors.toList());

        return history.stream().map(this::toTrackerResponse).collect(Collectors.toList());
    }

    // ========== DEPARTMENTS ==========

    public List<Department> getAllDepartments() {
        return departmentRepository.findAllByOrderByDeptNameAsc();
    }

    public List<Department> getActiveDepartments() {
        return departmentRepository.findByActiveTrueOrderByDeptNameAsc();
    }

    @Transactional
    public Department createDepartment(String aoUsername, DepartmentRequest request) {
        Department dept = Department.builder()
                .deptName(request.getDeptName())
                .responderTypeCategory(request.getResponderTypeCategory())
                .focalPersonName(request.getFocalPersonName())
                .focalPersonNumber(request.getFocalPersonNumber())
                .deptAddress(request.getDeptAddress())
                .deptEmail(request.getDeptEmail())
                .entryPerson(aoUsername)
                .entryDate(LocalDate.now())
                .entryTime(LocalTime.now())
                .active(true)
                .build();

        // Link ResponderType if provided
        if (request.getResponderTypeId() != null && !request.getResponderTypeId().isBlank()) {
            responderTypeRepository.findById(request.getResponderTypeId())
                    .ifPresent(dept::setResponderType);
        }

        return departmentRepository.save(dept);
    }

    @Transactional
    public Department updateDepartment(Long deptId, DepartmentRequest request) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found: " + deptId));

        dept.setDeptName(request.getDeptName());
        dept.setResponderTypeCategory(request.getResponderTypeCategory());
        dept.setFocalPersonName(request.getFocalPersonName());
        dept.setFocalPersonNumber(request.getFocalPersonNumber());
        dept.setDeptAddress(request.getDeptAddress());
        dept.setDeptEmail(request.getDeptEmail());

        if (request.getResponderTypeId() != null && !request.getResponderTypeId().isBlank()) {
            responderTypeRepository.findById(request.getResponderTypeId())
                    .ifPresent(dept::setResponderType);
        }

        return departmentRepository.save(dept);
    }

    @Transactional
    public void deactivateDepartment(Long deptId) {
        Department dept = departmentRepository.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found: " + deptId));
        dept.setActive(false);
        departmentRepository.save(dept);
    }

    // ========== HELPER ==========

    private String getForwardedStatus(ForwardedComplaint c) {
        if (c.getWorkerDecision() == Decision.D) return "COMPLETED";
        if (c.getDeptDecision() == Decision.R) return "REJECTED";
        if (Boolean.TRUE.equals(c.getAcceptedByWorker())) return "IN_PROGRESS";
        if (Boolean.TRUE.equals(c.getAssignedToWorker())) return "WITH_VOLUNTEER";
        if (c.getDeptDecision() == Decision.D) return "ACCEPTED";
        if (Boolean.TRUE.equals(c.getReadByDept())) return "READ";
        return "PENDING";
    }

    private Map<String, Object> toTrackerResponse(ForwardedComplaint c) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("forwardedComplainId", c.getForwardedComplainId());
        item.put("reportId", c.getReportId());
        item.put("sosId", c.getSosId());
        item.put("status", getForwardedStatus(c));
        item.put("priority", c.getPriority());
        item.put("remarks", c.getRemarks());
        item.put("submitDate", c.getSubmitDate() != null ? c.getSubmitDate().toString() : null);
        item.put("submitTime", c.getSubmitTime() != null ? c.getSubmitTime().toString() : null);

        if (c.getDepartment() != null) {
            Map<String, Object> dept = new LinkedHashMap<>();
            dept.put("deptId", c.getDepartment().getDeptId());
            dept.put("deptName", c.getDepartment().getDeptName());
            dept.put("category", c.getDepartment().getResponderTypeCategory());
            item.put("department", dept);
        }

        if (c.getCitizen() != null) {
            Map<String, Object> citizen = new LinkedHashMap<>();
            citizen.put("id", c.getCitizen().getId());
            citizen.put("fullName", c.getCitizen().getFullName());
            item.put("citizen", citizen);
        }

        if (c.getDeptUser() != null) {
            item.put("responderName", c.getDeptUser().getName());
            item.put("responderUsername", c.getDeptUser().getUsername());
        }

        if (c.getWorker() != null) {
            item.put("workerName", c.getWorker().getName());
        }

        // Status timeline
        Map<String, Object> timeline = new LinkedHashMap<>();
        timeline.put("dispatched", c.getSubmitDate() != null);
        timeline.put("dispatchedAt", c.getSubmitDate() != null ? c.getSubmitDate() + " " + c.getSubmitTime() : null);
        timeline.put("acknowledged", Boolean.TRUE.equals(c.getReadByDept()));
        timeline.put("acknowledgedAt", c.getReadByDeptDate() != null ? c.getReadByDeptDate() + " " + c.getReadByDeptTime() : null);
        timeline.put("assignedToWorker", Boolean.TRUE.equals(c.getAssignedToWorker()));
        timeline.put("assignedAt", c.getAssignedWorkerDate() != null ? c.getAssignedWorkerDate() + " " + c.getAssignedWorkerTime() : null);
        timeline.put("completed", c.getWorkerDecision() == Decision.D);
        timeline.put("completedAt", c.getAcceptedDate() != null ? c.getAcceptedDate() + " " + c.getAcceptedTime() : null);
        item.put("timeline", timeline);

        return item;
    }
}
