package nexora_backend.database.repository;

import nexora_backend.database.entity.RegisterCitizen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RegisterCitizenRepository extends JpaRepository<RegisterCitizen, Long> {
    Optional<RegisterCitizen> findByPhoneNumber(String phoneNumber);
}
