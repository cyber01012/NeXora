package nexora_backend.responder.repository;

import nexora_backend.responder.entity.ResponderTaskHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResponderTaskHistoryRepository extends JpaRepository<ResponderTaskHistory, Long> {

    List<ResponderTaskHistory> findByTaskIdOrderByCreatedAtDesc(Long taskId);

    List<ResponderTaskHistory> findByPerformedByOrderByCreatedAtDesc(String performedBy);
}