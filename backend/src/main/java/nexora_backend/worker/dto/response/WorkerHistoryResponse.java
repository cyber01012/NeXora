package nexora_backend.worker.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Response DTO for the Worker Task History endpoint.
 * Extends task info with final outcome fields.
 */
public class WorkerHistoryResponse {

    private Long id;
    private Long reportId;
    private Long sosId;
    private String finalDecision;    // COMPLETED | REJECTED
    private String priority;
    private String remarks;

    private String departmentName;
    private Long departmentId;

    private String citizenName;
    private String citizenPhone;
    private boolean anonymous;

    private LocalDate submitDate;
    private LocalTime submitTime;
    private LocalDate completedDate;
    private LocalTime completedTime;

    private String responderName;

    // ========== CONSTRUCTORS ==========
    public WorkerHistoryResponse() {}

    // ========== GETTERS ==========
    public Long getId()                { return id; }
    public Long getReportId()          { return reportId; }
    public Long getSosId()             { return sosId; }
    public String getFinalDecision()   { return finalDecision; }
    public String getPriority()        { return priority; }
    public String getRemarks()         { return remarks; }
    public String getDepartmentName()  { return departmentName; }
    public Long getDepartmentId()      { return departmentId; }
    public String getCitizenName()     { return citizenName; }
    public String getCitizenPhone()    { return citizenPhone; }
    public boolean isAnonymous()       { return anonymous; }
    public LocalDate getSubmitDate()   { return submitDate; }
    public LocalTime getSubmitTime()   { return submitTime; }
    public LocalDate getCompletedDate(){ return completedDate; }
    public LocalTime getCompletedTime(){ return completedTime; }
    public String getResponderName()   { return responderName; }

    // ========== SETTERS ==========
    public void setId(Long id)                         { this.id = id; }
    public void setReportId(Long reportId)             { this.reportId = reportId; }
    public void setSosId(Long sosId)                   { this.sosId = sosId; }
    public void setFinalDecision(String finalDecision) { this.finalDecision = finalDecision; }
    public void setPriority(String priority)           { this.priority = priority; }
    public void setRemarks(String remarks)             { this.remarks = remarks; }
    public void setDepartmentName(String v)            { this.departmentName = v; }
    public void setDepartmentId(Long v)                { this.departmentId = v; }
    public void setCitizenName(String citizenName)     { this.citizenName = citizenName; }
    public void setCitizenPhone(String citizenPhone)   { this.citizenPhone = citizenPhone; }
    public void setAnonymous(boolean anonymous)        { this.anonymous = anonymous; }
    public void setSubmitDate(LocalDate submitDate)    { this.submitDate = submitDate; }
    public void setSubmitTime(LocalTime submitTime)    { this.submitTime = submitTime; }
    public void setCompletedDate(LocalDate v)          { this.completedDate = v; }
    public void setCompletedTime(LocalTime v)          { this.completedTime = v; }
    public void setResponderName(String v)             { this.responderName = v; }

    // ========== BUILDER ==========
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long reportId;
        private Long sosId;
        private String finalDecision;
        private String priority;
        private String remarks;
        private String departmentName;
        private Long departmentId;
        private String citizenName;
        private String citizenPhone;
        private boolean anonymous;
        private LocalDate submitDate;
        private LocalTime submitTime;
        private LocalDate completedDate;
        private LocalTime completedTime;
        private String responderName;

        public Builder id(Long v)               { this.id = v; return this; }
        public Builder reportId(Long v)         { this.reportId = v; return this; }
        public Builder sosId(Long v)            { this.sosId = v; return this; }
        public Builder finalDecision(String v)  { this.finalDecision = v; return this; }
        public Builder priority(String v)       { this.priority = v; return this; }
        public Builder remarks(String v)        { this.remarks = v; return this; }
        public Builder departmentName(String v) { this.departmentName = v; return this; }
        public Builder departmentId(Long v)     { this.departmentId = v; return this; }
        public Builder citizenName(String v)    { this.citizenName = v; return this; }
        public Builder citizenPhone(String v)   { this.citizenPhone = v; return this; }
        public Builder anonymous(boolean v)     { this.anonymous = v; return this; }
        public Builder submitDate(LocalDate v)  { this.submitDate = v; return this; }
        public Builder submitTime(LocalTime v)  { this.submitTime = v; return this; }
        public Builder completedDate(LocalDate v){ this.completedDate = v; return this; }
        public Builder completedTime(LocalTime v){ this.completedTime = v; return this; }
        public Builder responderName(String v)  { this.responderName = v; return this; }

        public WorkerHistoryResponse build() {
            WorkerHistoryResponse r = new WorkerHistoryResponse();
            r.id             = this.id;
            r.reportId       = this.reportId;
            r.sosId          = this.sosId;
            r.finalDecision  = this.finalDecision;
            r.priority       = this.priority;
            r.remarks        = this.remarks;
            r.departmentName = this.departmentName;
            r.departmentId   = this.departmentId;
            r.citizenName    = this.citizenName;
            r.citizenPhone   = this.citizenPhone;
            r.anonymous      = this.anonymous;
            r.submitDate     = this.submitDate;
            r.submitTime     = this.submitTime;
            r.completedDate  = this.completedDate;
            r.completedTime  = this.completedTime;
            r.responderName  = this.responderName;
            return r;
        }
    }
}
