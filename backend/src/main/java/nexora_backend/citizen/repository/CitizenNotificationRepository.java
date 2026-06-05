package nexora_backend.citizen.repository;

import nexora_backend.citizen.entity.CitizenNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CitizenNotificationRepository extends JpaRepository<CitizenNotification, Long> {
    List<CitizenNotification> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
    Optional<CitizenNotification> findByIdAndCitizenId(Long id, Long citizenId);
}