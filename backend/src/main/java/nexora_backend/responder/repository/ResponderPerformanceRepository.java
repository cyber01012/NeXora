package nexora_backend.responder.repository;

import nexora_backend.responder.entity.ResponderPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ResponderPerformanceRepository extends JpaRepository<ResponderPerformance, Long> {

    Optional<ResponderPerformance> findByResponderId(String responderId);
}