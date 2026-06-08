package nexora_backend.database.repository;

import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForwardedComplaintRepository extends JpaRepository<ForwardedComplaint, Long> {

    // ========== RESPONDER QUERIES ==========
    List<ForwardedComplaint> findByDepartment_DeptIdOrderBySubmitDateDesc(Long deptId);
    List<ForwardedComplaint> findByDepartment_DeptId(Long deptId);
    List<ForwardedComplaint> findByDepartment_DeptIdAndDeptDecisionIsNull(Long deptId);
    List<ForwardedComplaint> findByDepartment_DeptIdAndDeptDecisionAndWorkerDecisionIsNull(Long deptId, Decision deptDecision);
    List<ForwardedComplaint> findByDepartment_DeptIdAndWorkerDecision(Long deptId, Decision workerDecision);
    List<ForwardedComplaint> findByDepartment_DeptIdAndDeptDecision(Long deptId, Decision deptDecision);

    // ========== WORKER QUERIES ==========
    // All tasks assigned to a specific worker
    List<ForwardedComplaint> findByWorker_UsernameCreatedOrderBySubmitDateDesc(String workerUsername);

    // Tasks assigned but not yet accepted (pending worker acceptance)
    List<ForwardedComplaint> findByWorker_UsernameCreatedAndAssignedToWorkerTrueAndAcceptedByWorkerFalseOrWorker_UsernameCreatedAndAssignedToWorkerTrueAndAcceptedByWorkerIsNull(
            String workerUsername1, String workerUsername2);

    // Tasks accepted and actively in progress (no workerDecision yet)
    List<ForwardedComplaint> findByWorker_UsernameCreatedAndAcceptedByWorkerTrueAndWorkerDecisionIsNull(String workerUsername);

    // History: tasks with a final workerDecision (D = completed, R = rejected)
    List<ForwardedComplaint> findByWorker_UsernameCreatedAndWorkerDecisionIsNotNull(String workerUsername);

    // History by specific decision
    List<ForwardedComplaint> findByWorker_UsernameCreatedAndWorkerDecision(String workerUsername, Decision decision);

    // Count helpers for dashboard
    long countByWorker_UsernameCreatedAndWorkerDecision(String workerUsername, Decision decision);
    long countByWorker_UsernameCreatedAndWorkerDecisionIsNull(String workerUsername);
    long countByWorker_UsernameCreated(String workerUsername);
}