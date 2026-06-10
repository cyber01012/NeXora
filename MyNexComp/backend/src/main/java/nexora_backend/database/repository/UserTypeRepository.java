package nexora_backend.database.repository;

import nexora_backend.database.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserTypeRepository extends JpaRepository<UserType, Integer> {

    Optional<UserType> findByNameIgnoreCase(String name);
}
