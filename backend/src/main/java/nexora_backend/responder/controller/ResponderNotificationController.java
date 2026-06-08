//package nexora_backend.responder.controller;
//
//import nexora_backend.responder.entity.ResponderNotification;
//import nexora_backend.responder.service.ResponderNotificationService;
//import nexora_backend.shared.dto.ApiResponse;
//import nexora_backend.shared.util.RequestContext;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/responder/notifications")
//public class ResponderNotificationController {
//
//    private final ResponderNotificationService notificationService;
//    private final RequestContext requestContext;
//
//    public ResponderNotificationController(ResponderNotificationService notificationService, RequestContext requestContext) {
//        this.notificationService = notificationService;
//        this.requestContext = requestContext;
//    }
//
//    @GetMapping
//    public ApiResponse<List<ResponderNotification>> getNotifications() {
//        String username = requestContext.getResponderUsername();
//        return ApiResponse.ok(notificationService.getNotifications(username));
//    }
//
//    @PutMapping("/{id}/read")
//    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
//        String username = requestContext.getResponderUsername();
//        notificationService.markAsRead(username, id);
//        return ApiResponse.okMessage("Notification marked as read");
//    }
//
//    @DeleteMapping("/{id}")
//    public ApiResponse<Void> deleteNotification(@PathVariable Long id) {
//        String username = requestContext.getResponderUsername();
//        notificationService.deleteNotification(username, id);
//        return ApiResponse.okMessage("Notification deleted");
//    }
//}
