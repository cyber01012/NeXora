package nexora_backend.responder.dto.request;

public class ForwardDecisionRequest {

    private Long forwardedComplainId;
    private String evidence;
    private String description;

    // ========== CONSTRUCTORS ==========
    public ForwardDecisionRequest() {}

    public ForwardDecisionRequest(Long forwardedComplainId, String evidence, String description) {
        this.forwardedComplainId = forwardedComplainId;
        this.evidence = evidence;
        this.description = description;
    }

    // ========== GETTERS ==========
    public Long getForwardedComplainId() {
        return forwardedComplainId;
    }

    public String getEvidence() {
        return evidence;
    }

    public String getDescription() {
        return description;
    }

    // ========== SETTERS ==========
    public void setForwardedComplainId(Long forwardedComplainId) {
        this.forwardedComplainId = forwardedComplainId;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}