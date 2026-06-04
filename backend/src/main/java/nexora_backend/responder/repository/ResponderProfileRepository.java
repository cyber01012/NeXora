package nexora_backend.responder.repository;

import nexora_backend.responder.entity.ResponderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ResponderProfileRepository extends JpaRepository<ResponderProfile, Long> {

    Optional<ResponderProfile> findByResponderUsername(String username);
}