package nexora_backend.database.repository;

import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForwardedComplaintRepository extends JpaRepository<ForwardedComplaint, Long> {

    List<ForwardedComplaint> findByDepartment_DeptIdOrderBySubmitDateDesc(Long deptId);

    List<ForwardedComplaint> findByDepartment_DeptId(Long deptId);

    // PENDING: deptDecision IS NULL
    List<ForwardedComplaint> findByDepartment_DeptIdAndDeptDecisionIsNull(Long deptId);

    // ACTIVE: deptDecision = 'D' AND workerDecision IS NULL
    List<ForwardedComplaint> findByDepartment_DeptIdAndDeptDecisionAndWorkerDecisionIsNull(Long deptId, Decision deptDecision);

    // COMPLETED: workerDecision = 'D'
    List<ForwardedComplaint> findByDepartment_DeptIdAndWorkerDecision(Long deptId, Decision workerDecision);

    // REJECTED: deptDecision = 'R'
    List<ForwardedComplaint> findByDepartment_DeptIdAndDeptDecision(Long deptId, Decision deptDecision);
}