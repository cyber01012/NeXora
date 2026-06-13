package nexora_backend.citizen.repository;

import nexora_backend.independent.entity.CitizenSavedLocation;  // ✅ ADD THIS EXPLICIT IMPORT
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CitizenSavedLocationRepository extends JpaRepository<CitizenSavedLocation, Long> {

    List<CitizenSavedLocation> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);

    Optional<CitizenSavedLocation> findByIdAndCitizenId(Long id, Long citizenId);
}