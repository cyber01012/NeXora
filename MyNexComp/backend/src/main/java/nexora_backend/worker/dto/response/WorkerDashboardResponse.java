package nexora_backend.worker.dto.response;

import java.util.List;

/**
 * Response DTO for the Worker Dashboard endpoint.
 * Carries aggregated stats computed from the worker's ForwardedComplaint records.
 */
public class WorkerDashboardResponse {

    private String workerUsername;
    private String workerName;
    private String department;
    private Long departmentId;

    // Task counts
    private long totalAssigned;
    private long pendingAcceptance;   // assigned but not yet accepted
    private long inProgress;          // accepted, workerDecision null
    private long completed;           // workerDecision = D
    private long rejected;            // workerDecision = R
    private List<Integer> monthlyCompleted; // 12-element list, Jan–Dec for current year

    // ========== CONSTRUCTORS ==========
    public WorkerDashboardResponse() {}

    // ========== GETTERS ==========
    public String getWorkerUsername()    { return workerUsername; }
    public String getWorkerName()        { return workerName; }
    public String getDepartment()        { return department; }
    public Long getDepartmentId()        { return departmentId; }
    public long getTotalAssigned()       { return totalAssigned; }
    public long getPendingAcceptance()   { return pendingAcceptance; }
    public long getInProgress()          { return inProgress; }
    public long getCompleted()           { return completed; }
    public long getRejected()            { return rejected; }
    public List<Integer> getMonthlyCompleted() { return monthlyCompleted; }

    // ========== SETTERS ==========
    public void setWorkerUsername(String workerUsername)     { this.workerUsername = workerUsername; }
    public void setWorkerName(String workerName)             { this.workerName = workerName; }
    public void setDepartment(String department)             { this.department = department; }
    public void setDepartmentId(Long departmentId)           { this.departmentId = departmentId; }
    public void setTotalAssigned(long totalAssigned)         { this.totalAssigned = totalAssigned; }
    public void setPendingAcceptance(long pendingAcceptance) { this.pendingAcceptance = pendingAcceptance; }
    public void setInProgress(long inProgress)               { this.inProgress = inProgress; }
    public void setCompleted(long completed)                 { this.completed = completed; }
    public void setRejected(long rejected)                   { this.rejected = rejected; }
    public void setMonthlyCompleted(List<Integer> v)         { this.monthlyCompleted = v; }

    // ========== BUILDER ==========
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String workerUsername;
        private String workerName;
        private String department;
        private Long departmentId;
        private long totalAssigned;
        private long pendingAcceptance;
        private long inProgress;
        private long completed;
        private long rejected;
        private List<Integer> monthlyCompleted;

        public Builder workerUsername(String v)     { this.workerUsername = v; return this; }
        public Builder workerName(String v)         { this.workerName = v; return this; }
        public Builder department(String v)         { this.department = v; return this; }
        public Builder departmentId(Long v)         { this.departmentId = v; return this; }
        public Builder totalAssigned(long v)        { this.totalAssigned = v; return this; }
        public Builder pendingAcceptance(long v)    { this.pendingAcceptance = v; return this; }
        public Builder inProgress(long v)           { this.inProgress = v; return this; }
        public Builder completed(long v)            { this.completed = v; return this; }
        public Builder rejected(long v)             { this.rejected = v; return this; }
        public Builder monthlyCompleted(List<Integer> v) { this.monthlyCompleted = v; return this; }

        public WorkerDashboardResponse build() {
            WorkerDashboardResponse r = new WorkerDashboardResponse();
            r.workerUsername  = this.workerUsername;
            r.workerName      = this.workerName;
            r.department      = this.department;
            r.departmentId    = this.departmentId;
            r.totalAssigned   = this.totalAssigned;
            r.pendingAcceptance = this.pendingAcceptance;
            r.inProgress      = this.inProgress;
            r.completed       = this.completed;
            r.rejected        = this.rejected;
            r.monthlyCompleted = this.monthlyCompleted;
            return r;
        }
    }
}
