//package nexora_backend.responder.mapper;
//
//import nexora_backend.database.entity.AdminUser;
//import nexora_backend.database.entity.ForwardedComplaint;
//import nexora_backend.database.enums.Decision;
//import nexora_backend.responder.dto.response.TaskHistoryResponse;
//import nexora_backend.responder.dto.response.TaskResponse;
//import nexora_backend.responder.entity.ResponderTaskHistory;
//import org.springframework.stereotype.Component;
//
//import java.time.format.DateTimeFormatter;
//
//@Component
//public class TaskMapper {
//
//    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
//
//    public TaskResponse toResponse(ForwardedComplaint complaint, AdminUser responder) {
//        if (complaint == null) return null;
//
//        String status = getStatus(complaint);
//
//        TaskResponse response = new TaskResponse();
//        response.setId(complaint.getForwardedComplainId());
//        response.setForwardedComplaintId(complaint.getForwardedComplainId());
//        response.setResponderId(responder != null ? responder.getUsername() : null);
//        response.setTitle(getTitleFromReport(complaint));
//        response.setDescription(complaint.getRemarks());
//        response.setLocationAddress(complaint.getDepartment() != null ? complaint.getDepartment().getDeptAddress() : null);
//        response.setLatitude(null); // Will be set from report if needed
//        response.setLongitude(null);
//        response.setPriority(getPriority(complaint));
//        response.setStatus(status);
//        response.setAcceptedAt(complaint.getReadByDeptDate() != null ?
//                complaint.getReadByDeptDate().atTime(complaint.getReadByDeptTime()) : null);
//        response.setCompletedAt(complaint.getWorkerDecision() == Decision.D ?
//                complaint.getAssignedWorkerDate().atTime(complaint.getAssignedWorkerTime()) : null);
//        response.setCreatedAt(complaint.getSubmitDate().atTime(complaint.getSubmitTime()));
//        response.setWorkerName(complaint.getWorker() != null ? complaint.getWorker().getName() : null);
//
//        return response;
//    }
//
//    public TaskHistoryResponse toHistoryResponse(ResponderTaskHistory history, Void unused) {
//        if (history == null) return null;
//
//        TaskHistoryResponse response = new TaskHistoryResponse();
//        response.setId(history.getId());
//        response.setTaskId(history.getTaskId());
//        response.setAction(history.getAction());
//        response.setPerformedBy(history.getPerformedBy());
//        response.setNotes(history.getNotes());
//        response.setCreatedAt(history.getCreatedAt());
//
//        return response;
//    }
//
//    private String getStatus(ForwardedComplaint complaint) {
//        if (complaint.getWorkerDecision() == Decision.D) {
//            return "COMPLETED";
//        }
//        if (complaint.getDeptDecision() == Decision.R) {
//            return "REJECTED";
//        }
//        if (complaint.getAssignedToWorker() != null && complaint.getAssignedToWorker()) {
//            if (complaint.getAcceptedByWorker() != null && complaint.getAcceptedByWorker()) {
//                return "IN_PROGRESS";
//            }
//            return "WITH_VOLUNTEER";
//        }
//        if (complaint.getReadByDept() != null && complaint.getReadByDept()) {
//            return "ACCEPTED";
//        }
//        return "PENDING";
//    }
//
//    private String getTitleFromReport(ForwardedComplaint complaint) {
//        if (complaint.getReportId() != null) {
//            return "Report #" + complaint.getReportId();
//        }
//        if (complaint.getSosId() != null) {
//            return "SOS #" + complaint.getSosId();
//        }
//        return "Complaint forwarded to " +
//                (complaint.getDepartment() != null ? complaint.getDepartment().getDeptName() : "Department");
//    }
//
//    private String getPriority(ForwardedComplaint complaint) {
//        // Priority can be determined from report or default to MEDIUM
//        return "MEDIUM";
//    }
//}