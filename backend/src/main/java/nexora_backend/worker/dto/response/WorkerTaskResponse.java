package nexora_backend.worker.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Response DTO for a single task assigned to a worker.
 * Flattened from ForwardedComplaint to avoid lazy-loading issues.
 */
public class WorkerTaskResponse {

    private Long id;
    private Long reportId;
    private Long sosId;
    private String status;       // PENDING_ACCEPTANCE | IN_PROGRESS | COMPLETED | REJECTED
    private String priority;     // HIGH | MEDIUM | LOW
    private String remarks;

    // Department info (worker's task context)
    private String departmentName;
    private Long departmentId;
    private String departmentAddress;

    // Reporter info
    private String citizenName;
    private String citizenPhone;
    private boolean anonymous;

    // Timestamps
    private LocalDate submitDate;
    private LocalTime submitTime;
    private LocalDate assignedDate;
    private LocalTime assignedTime;
    private LocalDate acceptedDate;
    private LocalTime acceptedTime;

    // Responder who assigned the task
    private String responderUsername;
    private String responderName;

    // ========== CONSTRUCTORS ==========
    public WorkerTaskResponse() {}

    // ========== GETTERS ==========
    public Long getId()                  { return id; }
    public Long getReportId()            { return reportId; }
    public Long getSosId()               { return sosId; }
    public String getStatus()            { return status; }
    public String getPriority()          { return priority; }
    public String getRemarks()           { return remarks; }
    public String getDepartmentName()    { return departmentName; }
    public Long getDepartmentId()        { return departmentId; }
    public String getDepartmentAddress() { return departmentAddress; }
    public String getCitizenName()       { return citizenName; }
    public String getCitizenPhone()      { return citizenPhone; }
    public boolean isAnonymous()         { return anonymous; }
    public LocalDate getSubmitDate()     { return submitDate; }
    public LocalTime getSubmitTime()     { return submitTime; }
    public LocalDate getAssignedDate()   { return assignedDate; }
    public LocalTime getAssignedTime()   { return assignedTime; }
    public LocalDate getAcceptedDate()   { return acceptedDate; }
    public LocalTime getAcceptedTime()   { return acceptedTime; }
    public String getResponderUsername() { return responderUsername; }
    public String getResponderName()     { return responderName; }

    // ========== SETTERS ==========
    public void setId(Long id)                           { this.id = id; }
    public void setReportId(Long reportId)               { this.reportId = reportId; }
    public void setSosId(Long sosId)                     { this.sosId = sosId; }
    public void setStatus(String status)                 { this.status = status; }
    public void setPriority(String priority)             { this.priority = priority; }
    public void setRemarks(String remarks)               { this.remarks = remarks; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public void setDepartmentId(Long departmentId)       { this.departmentId = departmentId; }
    public void setDepartmentAddress(String v)           { this.departmentAddress = v; }
    public void setCitizenName(String citizenName)       { this.citizenName = citizenName; }
    public void setCitizenPhone(String citizenPhone)     { this.citizenPhone = citizenPhone; }
    public void setAnonymous(boolean anonymous)          { this.anonymous = anonymous; }
    public void setSubmitDate(LocalDate submitDate)      { this.submitDate = submitDate; }
    public void setSubmitTime(LocalTime submitTime)      { this.submitTime = submitTime; }
    public void setAssignedDate(LocalDate v)             { this.assignedDate = v; }
    public void setAssignedTime(LocalTime v)             { this.assignedTime = v; }
    public void setAcceptedDate(LocalDate v)             { this.acceptedDate = v; }
    public void setAcceptedTime(LocalTime v)             { this.acceptedTime = v; }
    public void setResponderUsername(String v)           { this.responderUsername = v; }
    public void setResponderName(String v)               { this.responderName = v; }

    // ========== BUILDER ==========
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long reportId;
        private Long sosId;
        private String status;
        private String priority;
        private String remarks;
        private String departmentName;
        private Long departmentId;
        private String departmentAddress;
        private String citizenName;
        private String citizenPhone;
        private boolean anonymous;
        private LocalDate submitDate;
        private LocalTime submitTime;
        private LocalDate assignedDate;
        private LocalTime assignedTime;
        private LocalDate acceptedDate;
        private LocalTime acceptedTime;
        private String responderUsername;
        private String responderName;

        public Builder id(Long v)                   { this.id = v; return this; }
        public Builder reportId(Long v)             { this.reportId = v; return this; }
        public Builder sosId(Long v)                { this.sosId = v; return this; }
        public Builder status(String v)             { this.status = v; return this; }
        public Builder priority(String v)           { this.priority = v; return this; }
        public Builder remarks(String v)            { this.remarks = v; return this; }
        public Builder departmentName(String v)     { this.departmentName = v; return this; }
        public Builder departmentId(Long v)         { this.departmentId = v; return this; }
        public Builder departmentAddress(String v)  { this.departmentAddress = v; return this; }
        public Builder citizenName(String v)        { this.citizenName = v; return this; }
        public Builder citizenPhone(String v)       { this.citizenPhone = v; return this; }
        public Builder anonymous(boolean v)         { this.anonymous = v; return this; }
        public Builder submitDate(LocalDate v)      { this.submitDate = v; return this; }
        public Builder submitTime(LocalTime v)      { this.submitTime = v; return this; }
        public Builder assignedDate(LocalDate v)    { this.assignedDate = v; return this; }
        public Builder assignedTime(LocalTime v)    { this.assignedTime = v; return this; }
        public Builder acceptedDate(LocalDate v)    { this.acceptedDate = v; return this; }
        public Builder acceptedTime(LocalTime v)    { this.acceptedTime = v; return this; }
        public Builder responderUsername(String v)  { this.responderUsername = v; return this; }
        public Builder responderName(String v)      { this.responderName = v; return this; }

        public WorkerTaskResponse build() {
            WorkerTaskResponse r = new WorkerTaskResponse();
            r.id                = this.id;
            r.reportId          = this.reportId;
            r.sosId             = this.sosId;
            r.status            = this.status;
            r.priority          = this.priority;
            r.remarks           = this.remarks;
            r.departmentName    = this.departmentName;
            r.departmentId      = this.departmentId;
            r.departmentAddress = this.departmentAddress;
            r.citizenName       = this.citizenName;
            r.citizenPhone      = this.citizenPhone;
            r.anonymous         = this.anonymous;
            r.submitDate        = this.submitDate;
            r.submitTime        = this.submitTime;
            r.assignedDate      = this.assignedDate;
            r.assignedTime      = this.assignedTime;
            r.acceptedDate      = this.acceptedDate;
            r.acceptedTime      = this.acceptedTime;
            r.responderUsername = this.responderUsername;
            r.responderName     = this.responderName;
            return r;
        }
    }
}
