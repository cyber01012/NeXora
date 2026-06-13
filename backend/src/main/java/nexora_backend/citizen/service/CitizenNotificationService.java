package nexora_backend.citizen.service;//package nexora_backend.citizen.service;
//
//import nexora_backend.citizen.dto.response.NotificationResponse;
//import nexora_backend.citizen.entity.CitizenNotification;
//import nexora_backend.citizen.repository.CitizenNotificationRepository;
//import nexora_backend.shared.exception.BusinessException;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class CitizenNotificationService {
//
//    private final CitizenNotificationRepository notificationRepository;
//
//    public CitizenNotificationService(CitizenNotificationRepository notificationRepository) {
//        this.notificationRepository = notificationRepository;
//    }
//
//    public List<NotificationResponse> getNotifications(Long citizenId) {
//        return notificationRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId)
//                .stream().map(this::toResponse).collect(Collectors.toList());
//    }
//
//    @Transactional
//    public void markAsRead(Long citizenId, Long notificationId) {
//        CitizenNotification notification = notificationRepository
//                .findByIdAndCitizenId(notificationId, citizenId)
//                .orElseThrow(() -> new BusinessException("Notification not found", HttpStatus.NOT_FOUND));
//        notification.setIsRead(true);
//        notificationRepository.save(notification);
//    }
//
//    @Transactional
//    public void notifyReportSubmitted(Long citizenId, String trackingCode) {
//        CitizenNotification n = CitizenNotification.builder()
//                .citizenId(citizenId)
//                .title("Report Submitted")
//                .message("Your report " + trackingCode + " has been submitted and is pending admin review.")
//                .type("SYSTEM")
//                .isRead(false)
//                .build();
//        notificationRepository.save(n);
//    }
//
//    // ✅ ADD THIS METHOD
//    @Transactional
//    public void notifyTaskUpdate(Long citizenId, Long taskId, String title, String message) {
//        CitizenNotification n = CitizenNotification.builder()
//                .citizenId(citizenId)
//                .title(title)
//                .message(message)
//                .type("TASK_UPDATE")
//                .isRead(false)
//                .relatedTaskId(taskId)
//                .build();
//        notificationRepository.save(n);
//    }
//
//    private NotificationResponse toResponse(CitizenNotification n) {
//        return NotificationResponse.builder()
//                .id(n.getId())
//                .title(n.getTitle())
//                .message(n.getMessage())
//                .type(n.getType())
//                .isRead(n.getIsRead())
//                .relatedTaskId(n.getRelatedTaskId())
//                .createdAt(n.getCreatedAt())
//                .build();
//    }
//}