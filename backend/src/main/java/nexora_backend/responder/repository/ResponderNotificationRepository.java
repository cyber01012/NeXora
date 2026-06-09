package nexora_backend.responder.repository;//package nexora_backend.responder.repository;
//
//import nexora_backend.responder.entity.ResponderNotification;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//
//@Repository
//public interface ResponderNotificationRepository extends JpaRepository<ResponderNotification, Long> {
//    List<ResponderNotification> findByResponderUsernameOrderByCreatedAtDesc(String username);
//    List<ResponderNotification> findByResponderUsernameAndIsReadFalse(String username);
//}