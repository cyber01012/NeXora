package nexora_backend.responder.repository;//package nexora_backend.responder.repository;
//
//import nexora_backend.responder.entity.ResponderTask;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface ResponderTaskRepository extends JpaRepository<ResponderTask, Long> {
//
//    List<ResponderTask> findByResponderIdOrderByCreatedAtDesc(String responderId);
//
//    List<ResponderTask> findByResponderIdAndStatusOrderByCreatedAtDesc(String responderId, String status);
//
//    Optional<ResponderTask> findByIdAndResponderId(Long id, String responderId);
//
//    List<ResponderTask> findByStatus(String status);
//
//    List<ResponderTask> findByForwardedComplaintId(Long forwardedComplaintId);
//}