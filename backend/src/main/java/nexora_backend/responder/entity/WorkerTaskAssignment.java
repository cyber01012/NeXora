//package nexora_backend.responder.entity;
//
//import jakarta.persistence.*;
//import nexora_backend.database.entity.VolunteerWorkerCreator;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "worker_task_assignment")
//public class WorkerTaskAssignment {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "department_task_id", nullable = false)
//    private DepartmentTask departmentTask;
//
//    // ✅ CHANGE: ResponderWorker → VolunteerWorkerCreator
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "worker_username", referencedColumnName = "usernameCreated", nullable = false)
//    private VolunteerWorkerCreator worker;
//
//    @Column(length = 30)
//    private String status = "PENDING_WORKER";
//
//    @Column(name = "accepted_at")
//    private LocalDateTime acceptedAt;
//
//    @Column(name = "started_at")
//    private LocalDateTime startedAt;
//
//    @Column(name = "completed_at")
//    private LocalDateTime completedAt;
//
//    @Column(name = "rejection_reason", columnDefinition = "TEXT")
//    private String rejectionReason;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//
//    // ========== GETTERS ==========
//    public Long getId() { return id; }
//    public DepartmentTask getDepartmentTask() { return departmentTask; }
//    public VolunteerWorkerCreator getWorker() { return worker; }
//    public String getStatus() { return status; }
//    public LocalDateTime getAcceptedAt() { return acceptedAt; }
//    public LocalDateTime getStartedAt() { return startedAt; }
//    public LocalDateTime getCompletedAt() { return completedAt; }
//    public String getRejectionReason() { return rejectionReason; }
//    public LocalDateTime getCreatedAt() { return createdAt; }
//
//    // ========== SETTERS ==========
//    public void setId(Long id) { this.id = id; }
//    public void setDepartmentTask(DepartmentTask departmentTask) { this.departmentTask = departmentTask; }
//    public void setWorker(VolunteerWorkerCreator worker) { this.worker = worker; }
//    public void setStatus(String status) { this.status = status; }
//    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
//    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
//    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
//    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//
//    // ========== BUILDER ==========
//    public static WorkerTaskAssignmentBuilder builder() { return new WorkerTaskAssignmentBuilder(); }
//
//    public static class WorkerTaskAssignmentBuilder {
//        private Long id;
//        private DepartmentTask departmentTask;
//        private VolunteerWorkerCreator worker;
//        private String status = "PENDING_WORKER";
//        private LocalDateTime acceptedAt;
//        private LocalDateTime startedAt;
//        private LocalDateTime completedAt;
//        private String rejectionReason;
//        private LocalDateTime createdAt;
//
//        public WorkerTaskAssignmentBuilder id(Long id) { this.id = id; return this; }
//        public WorkerTaskAssignmentBuilder departmentTask(DepartmentTask departmentTask) { this.departmentTask = departmentTask; return this; }
//        public WorkerTaskAssignmentBuilder worker(VolunteerWorkerCreator worker) { this.worker = worker; return this; }
//        public WorkerTaskAssignmentBuilder status(String status) { this.status = status; return this; }
//        public WorkerTaskAssignmentBuilder acceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; return this; }
//        public WorkerTaskAssignmentBuilder startedAt(LocalDateTime startedAt) { this.startedAt = startedAt; return this; }
//        public WorkerTaskAssignmentBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }
//        public WorkerTaskAssignmentBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
//        public WorkerTaskAssignmentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
//
//        public WorkerTaskAssignment build() {
//            WorkerTaskAssignment assignment = new WorkerTaskAssignment();
//            assignment.id = this.id;
//            assignment.departmentTask = this.departmentTask;
//            assignment.worker = this.worker;
//            assignment.status = this.status;
//            assignment.acceptedAt = this.acceptedAt;
//            assignment.startedAt = this.startedAt;
//            assignment.completedAt = this.completedAt;
//            assignment.rejectionReason = this.rejectionReason;
//            assignment.createdAt = this.createdAt;
//            return assignment;
//        }
//    }
//}