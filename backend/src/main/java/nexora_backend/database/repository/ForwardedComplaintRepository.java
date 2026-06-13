package nexora_backend.database.repository;

import nexora_backend.database.entity.Department;
import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForwardedComplaintRepository extends JpaRepository<ForwardedComplaint, Long> {

    List<ForwardedComplaint> findByDepartmentAndReadByDeptFalse(Department department);

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

    // ========== ASSIGNING OFFICER QUERIES ==========

    // All forwarded complaints created by a specific AO
    List<ForwardedComplaint> findByAssigningOfficer_UsernameOrderBySubmitDateDesc(String username);

    // Count forwarded by AO
    long countByAssigningOfficer_Username(String username);

    // Active: dispatched but not yet completed (workerDecision IS NULL)
    List<ForwardedComplaint> findByAssigningOfficer_UsernameAndWorkerDecisionIsNull(String username);

    List<ForwardedComplaint> findByAssigningOfficer_UsernameAndWorkerDecision(String username, Decision workerDecision);

    // ========== WORKER QUERIES (by username only) ==========

    long countByWorker_UsernameCreated(String username);

    long countByWorker_UsernameCreatedAndWorkerDecision(String username, Decision workerDecision);

    long countByWorker_UsernameCreatedAndWorkerDecisionIsNull(String username);

    List<ForwardedComplaint> findByWorker_UsernameCreatedOrderBySubmitDateDesc(String username);

    List<ForwardedComplaint> findByWorker_UsernameCreatedAndAcceptedByWorkerTrueAndWorkerDecisionIsNull(String username);

    List<ForwardedComplaint> findByWorker_UsernameCreatedAndWorkerDecisionIsNotNull(String username);

    // ========== WORKER QUERIES (dept-scoped — primary for worker portal) ==========

    // All tasks assigned to a worker within their own department
    List<ForwardedComplaint> findByWorker_UsernameCreatedAndDepartment_DeptIdOrderBySubmitDateDesc(
            String username, Long deptId);

    // Pending acceptance: assigned=true, not yet accepted (null or false), no final decision
    @Query("SELECT fc FROM ForwardedComplaint fc WHERE fc.worker.usernameCreated = :username AND fc.department.deptId = :deptId AND fc.assignedToWorker = true AND (fc.acceptedByWorker IS NULL OR fc.acceptedByWorker = false) AND fc.workerDecision IS NULL")
    List<ForwardedComplaint> findPendingWorkerTasksByDept(@Param("username") String username, @Param("deptId") Long deptId);

    // Active (accepted, in-progress): accepted=true, no final decision yet
    List<ForwardedComplaint> findByWorker_UsernameCreatedAndDepartment_DeptIdAndAcceptedByWorkerTrueAndWorkerDecisionIsNull(
            String username, Long deptId);

    // History: tasks with a final workerDecision
    List<ForwardedComplaint> findByWorker_UsernameCreatedAndDepartment_DeptIdAndWorkerDecisionIsNotNull(
            String username, Long deptId);
}