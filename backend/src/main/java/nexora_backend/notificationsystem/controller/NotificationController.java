package nexora_backend.notificationsystem.controller;

import nexora_backend.database.entity.Notification;
import nexora_backend.notificationsystem.service.NotificationService;
import nexora_backend.auth.model.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getAll(@AuthenticationPrincipal AuthenticatedUser user) {
        String sourceId = user.getSourceId();
        String role = user.getRole().name();

        // 🔍 DEBUG — terminal mein dikhega
        System.out.println(">>> FETCH: sourceId=" + sourceId + ", role=" + role);

        return ResponseEntity.ok(notificationService.getAll(sourceId, role));
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnread(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(notificationService.getUnread(user.getSourceId(), user.getRole().name()));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal AuthenticatedUser user) {
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getSourceId(), user.getRole().name())));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedUser user) {
        notificationService.markAsRead(id, user.getSourceId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal AuthenticatedUser user) {
        notificationService.markAllAsRead(user.getSourceId(), user.getRole().name());
        return ResponseEntity.ok().build();
    }
}

//@RestController
//@RequestMapping("/api/notifications")
//@RequiredArgsConstructor
//public class NotificationController {
//    private final NotificationService notificationService;
//
//    @GetMapping
//    public ResponseEntity<List<Notification>> getAll(@AuthenticationPrincipal AuthenticatedUser user) {
//        return ResponseEntity.ok(notificationService.getAll(user.getSourceId()));
//    }
//
//    @GetMapping("/unread")
//    public ResponseEntity<List<Notification>> getUnread(@AuthenticationPrincipal AuthenticatedUser user) {
//        return ResponseEntity.ok(notificationService.getUnread(user.getSourceId()));
//    }
//
//    @GetMapping("/count")
//    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal AuthenticatedUser user) {
//        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(user.getSourceId())));
//    }
//
//    @PutMapping("/{id}/read")
//    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedUser user) {
//        notificationService.markAsRead(id, user.getSourceId());
//        return ResponseEntity.ok().build();
//    }
//
//    @PutMapping("/read-all")
//    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal AuthenticatedUser user) {
//        notificationService.markAllAsRead(user.getSourceId());
//        return ResponseEntity.ok().build();
//    }
//}
