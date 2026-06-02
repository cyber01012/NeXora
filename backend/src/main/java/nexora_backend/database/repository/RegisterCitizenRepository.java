package nexora_backend.database.repository;

import nexora_backend.database.entity.RegisterCitizen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegisterCitizenRepository extends JpaRepository<RegisterCitizen, Long> {

    Optional<RegisterCitizen> findByEmailIgnoreCase(String email);

    Optional<RegisterCitizen> findByPhoneNumber(String phoneNumber);

    Optional<RegisterCitizen> findByCnic(String cnic);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByCnic(String cnic);

    boolean existsByCnicAndIdNot(String cnic, Long id);

    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Long id);
}
