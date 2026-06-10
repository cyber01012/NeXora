package nexora_backend.responder.repository;//package nexora_backend.responder.repository;
//
//import nexora_backend.responder.entity.WorkerTaskAssignment;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//
//@Repository
//public interface WorkerTaskAssignmentRepository extends JpaRepository<WorkerTaskAssignment, Long> {
//
//    List<WorkerTaskAssignment> findByDepartmentTaskId(Long departmentTaskId);
//
//    List<WorkerTaskAssignment> findByWorkerUsernameCreated(String username);
//
//    List<WorkerTaskAssignment> findByWorkerUsernameCreatedAndStatus(String username, String status);
//}