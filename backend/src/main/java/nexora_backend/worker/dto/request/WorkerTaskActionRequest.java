package nexora_backend.worker.dto.request;

/**
 * Generic request DTO for worker task actions (reject, complete, progress, help).
 */
public class WorkerTaskActionRequest {

    private String reason;     // used for rejection reason
    private String remarks;    // used for completion remarks
    private String notes;      // used for progress/help notes

    public WorkerTaskActionRequest() {}

    public String getReason()  { return reason; }
    public String getRemarks() { return remarks; }
    public String getNotes()   { return notes; }

    public void setReason(String reason)   { this.reason = reason; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public void setNotes(String notes)     { this.notes = notes; }
}
