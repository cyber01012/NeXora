package nexora_backend.database.repository;

import nexora_backend.database.entity.ComplaintType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintTypeRepository extends JpaRepository<ComplaintType, Integer> {
}
