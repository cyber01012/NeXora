package nexora_backend.responder.repository;

import nexora_backend.responder.entity.DepartmentTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DepartmentTaskRepository extends JpaRepository<DepartmentTask, Long> {

    List<DepartmentTask> findByDepartmentDeptIdOrderByCreatedAtDesc(Long deptId);

    List<DepartmentTask> findByDepartmentDeptIdAndStatusOrderByCreatedAtDesc(Long deptId, String status);

    List<DepartmentTask> findByStatus(String status);
}