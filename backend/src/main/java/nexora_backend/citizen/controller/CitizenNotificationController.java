package nexora_backend.citizen.controller;//package nexora_backend.citizen.controller;
//
//import nexora_backend.citizen.dto.response.NotificationResponse;
//import nexora_backend.citizen.service.CitizenNotificationService;
//import nexora_backend.shared.dto.ApiResponse;
//import nexora_backend.shared.util.RequestContext;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/citizen/notifications")
//public class CitizenNotificationController {
//
//    private final CitizenNotificationService notificationService;
//    private final RequestContext requestContext;
//
//    public CitizenNotificationController(CitizenNotificationService notificationService, RequestContext requestContext) {
//        this.notificationService = notificationService;
//        this.requestContext = requestContext;
//    }
//
//    @GetMapping
//    public ApiResponse<List<NotificationResponse>> getNotifications() {
//        Long citizenId = requestContext.getCitizenId();
//        return ApiResponse.ok(notificationService.getNotifications(citizenId));
//    }
//
//    @PutMapping("/{id}/read")
//    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
//        Long citizenId = requestContext.getCitizenId();
//        notificationService.markAsRead(citizenId, id);
//        return ApiResponse.okMessage("Notification marked as read");
//    }
//}
