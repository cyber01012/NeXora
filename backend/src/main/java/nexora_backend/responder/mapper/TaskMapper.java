package nexora_backend.responder.mapper;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import nexora_backend.responder.dto.response.TaskHistoryResponse;
import nexora_backend.responder.dto.response.TaskResponse;
import nexora_backend.responder.entity.ResponderTaskHistory;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class TaskMapper {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");

    public TaskResponse toResponse(ForwardedComplaint complaint, AdminUser responder) {
        if (complaint == null) return null;

        String status = getStatus(complaint);

        return TaskResponse.builder()
                .id(complaint.getForwardedComplainId())
                .forwardedComplaintId(complaint.getForwardedComplainId())
                .responderId(responder != null ? responder.getUsername() : null)
                .title(getTitleFromReport(complaint))
                .description(complaint.getRemarks())
                .locationAddress(complaint.getDepartment() != null ? complaint.getDepartment().getDeptAddress() : null)
                .latitude(null) // Will be set from report if needed
                .longitude(null)
                .priority(getPriority(complaint))
                .status(status)
                .acceptedAt(complaint.getReadByDeptDate() != null ?
                        complaint.getReadByDeptDate().atTime(complaint.getReadByDeptTime()) : null)
                .completedAt(complaint.getWorkerDecision() == Decision.D ?
                        complaint.getAssignedWorkerDate().atTime(complaint.getAssignedWorkerTime()) : null)
                .createdAt(complaint.getSubmitDate().atTime(complaint.getSubmitTime()))
                .workerName(complaint.getWorker() != null ? complaint.getWorker().getName() : null)
                .build();
    }

    public TaskHistoryResponse toHistoryResponse(ResponderTaskHistory history, Void unused) {
        if (history == null) return null;

        return TaskHistoryResponse.builder()
                .id(history.getId())
                .taskId(history.getTaskId())
                .action(history.getAction())
                .performedBy(history.getPerformedBy())
                .notes(history.getNotes())
                .createdAt(history.getCreatedAt())
                .build();
    }

    private String getStatus(ForwardedComplaint complaint) {
        if (complaint.getWorkerDecision() == Decision.D) {
            return "COMPLETED";
        }
        if (complaint.getDeptDecision() == Decision.R) {
            return "REJECTED";
        }
        if (complaint.getAssignedToWorker() != null && complaint.getAssignedToWorker()) {
            if (complaint.getAcceptedByWorker() != null && complaint.getAcceptedByWorker()) {
                return "IN_PROGRESS";
            }
            return "WITH_VOLUNTEER";
        }
        if (complaint.getReadByDept() != null && complaint.getReadByDept()) {
            return "ACCEPTED";
        }
        return "PENDING";
    }

    private String getTitleFromReport(ForwardedComplaint complaint) {
        if (complaint.getReportId() != null) {
            return "Report #" + complaint.getReportId();
        }
        if (complaint.getSosId() != null) {
            return "SOS #" + complaint.getSosId();
        }
        return "Complaint forwarded to " +
                (complaint.getDepartment() != null ? complaint.getDepartment().getDeptName() : "Department");
    }

    private String getPriority(ForwardedComplaint complaint) {
        // Priority can be determined from report or default to MEDIUM
        return "MEDIUM";
    }
}