//package nexora_backend.responder.service;
//
//import nexora_backend.responder.entity.DepartmentTask;
//import nexora_backend.responder.entity.ResponderWorker;
//import nexora_backend.responder.entity.WorkerFieldReport;
//import nexora_backend.responder.entity.WorkerTaskAssignment;
//import nexora_backend.responder.repository.DepartmentTaskRepository;
//import nexora_backend.responder.repository.ResponderWorkerRepository;
//import nexora_backend.responder.repository.WorkerFieldReportRepository;
//import nexora_backend.responder.repository.WorkerTaskAssignmentRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//public class ResponderService {
//
//    private final DepartmentTaskRepository taskRepository;
//    private final ResponderWorkerRepository workerRepository;
//    private final WorkerTaskAssignmentRepository assignmentRepository;
//    private final WorkerFieldReportRepository fieldReportRepository;
//
//    // ✅ MANUAL CONSTRUCTOR
//    public ResponderService(DepartmentTaskRepository taskRepository,
//                            ResponderWorkerRepository workerRepository,
//                            WorkerTaskAssignmentRepository assignmentRepository,
//                            WorkerFieldReportRepository fieldReportRepository) {
//        this.taskRepository = taskRepository;
//        this.workerRepository = workerRepository;
//        this.assignmentRepository = assignmentRepository;
//        this.fieldReportRepository = fieldReportRepository;
//    }
//
//    public List<DepartmentTask> getTasks(String responderUsername) {
//        return taskRepository.findByResponderUsernameOrderByCreatedAtDesc(responderUsername);
//    }
//
//    @Transactional
//    public DepartmentTask acceptTask(Long taskId) {
//        DepartmentTask task = taskRepository.findById(taskId).orElseThrow();
//        task.setStatus("ACCEPTED");
//        task.setAcceptedAt(LocalDateTime.now());
//        return taskRepository.save(task);
//    }
//
//    @Transactional
//    public WorkerTaskAssignment forwardToWorker(Long taskId, String workerUsername) {
//        DepartmentTask task = taskRepository.findById(taskId).orElseThrow();
//        ResponderWorker worker = workerRepository.findByUsername(workerUsername).orElseThrow();
//
//        task.setStatus("WITH_WORKER");
//        taskRepository.save(task);
//
//        WorkerTaskAssignment assignment = new WorkerTaskAssignment();
//        assignment.setDepartmentTask(task);
//        assignment.setWorker(worker);
//        assignment.setStatus("PENDING_WORKER");
//        assignment.setCreatedAt(LocalDateTime.now());
//
//        return assignmentRepository.save(assignment);
//    }
//
//    public List<ResponderWorker> getWorkers(String responderUsername) {
//        return workerRepository.findByResponderUsername(responderUsername);
//    }
//
//    public List<WorkerFieldReport> getFieldReports(Long workerTaskId) {
//        return fieldReportRepository.findByWorkerTaskIdOrderBySubmittedAtDesc(workerTaskId);
//    }
//}