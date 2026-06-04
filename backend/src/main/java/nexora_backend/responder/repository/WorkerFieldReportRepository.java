package nexora_backend.responder.repository;

import nexora_backend.responder.entity.WorkerFieldReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WorkerFieldReportRepository extends JpaRepository<WorkerFieldReport, Long> {

    List<WorkerFieldReport> findByWorkerTaskIdOrderBySubmittedAtDesc(Long workerTaskId);

//    List<WorkerFieldReport> findByWorkerUsernameCreatedOrderBySubmittedAtDesc(String username);
}