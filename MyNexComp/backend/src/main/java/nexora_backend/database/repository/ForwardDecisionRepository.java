package nexora_backend.database.repository;

import nexora_backend.database.entity.ForwardDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForwardDecisionRepository extends JpaRepository<ForwardDecision, Long> {

    List<ForwardDecision> findByForwardedComplaint_ForwardedComplainId(Long forwardedComplainId);

    List<ForwardDecision> findByForwardedComplaint_Department_DeptIdOrderByDateDesc(Long deptId);
}