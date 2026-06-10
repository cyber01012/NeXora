package nexora_backend.responder.service;//package nexora_backend.responder.service;
//
//import nexora_backend.responder.entity.ResponderNotification;
//import nexora_backend.responder.repository.ResponderNotificationRepository;
//import nexora_backend.shared.exception.BusinessException;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//public class ResponderNotificationService {
//
//    private final ResponderNotificationRepository notificationRepository;
//
//    public ResponderNotificationService(ResponderNotificationRepository notificationRepository) {
//        this.notificationRepository = notificationRepository;
//    }
//
//    public List<ResponderNotification> getNotifications(String username) {
//        return notificationRepository.findByResponderUsernameOrderByCreatedAtDesc(username);
//    }
//
//    @Transactional
//    public void markAsRead(String username, Long notificationId) {
//        ResponderNotification notification = notificationRepository
//                .findById(notificationId)
//                .orElseThrow(() -> new BusinessException("Notification not found", HttpStatus.NOT_FOUND));
//
//        if (!notification.getResponderUsername().equals(username)) {
//            throw new BusinessException("Not authorized", HttpStatus.FORBIDDEN);
//        }
//
//        notification.setIsRead(true);
//        notificationRepository.save(notification);
//    }
//
//    @Transactional
//    public void deleteNotification(String username, Long notificationId) {
//        ResponderNotification notification = notificationRepository
//                .findById(notificationId)
//                .orElseThrow(() -> new BusinessException("Notification not found", HttpStatus.NOT_FOUND));
//
//        if (!notification.getResponderUsername().equals(username)) {
//            throw new BusinessException("Not authorized", HttpStatus.FORBIDDEN);
//        }
//
//        notificationRepository.delete(notification);
//    }
//}
