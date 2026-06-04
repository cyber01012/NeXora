package nexora_backend.database.entity;

import jakarta.persistence.*;
import nexora_backend.database.enums.Decision;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "forward_decision")
public class ForwardDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "forwarded_complain_id")
    private ForwardedComplaint forwardedComplaint;

    @Enumerated(EnumType.STRING)
    private Decision decisionType;

    private String evidence;
    private String description;
    private LocalDate date;
    private LocalTime time;

    // ========== CONSTRUCTORS ==========
    public ForwardDecision() {}

    public ForwardDecision(Long id, ForwardedComplaint forwardedComplaint, Decision decisionType,
                           String evidence, String description, LocalDate date, LocalTime time) {
        this.id = id;
        this.forwardedComplaint = forwardedComplaint;
        this.decisionType = decisionType;
        this.evidence = evidence;
        this.description = description;
        this.date = date;
        this.time = time;
    }

    // ========== GETTERS ==========
    public Long getId() { return id; }
    public ForwardedComplaint getForwardedComplaint() { return forwardedComplaint; }
    public Decision getDecisionType() { return decisionType; }
    public String getEvidence() { return evidence; }
    public String getDescription() { return description; }
    public LocalDate getDate() { return date; }
    public LocalTime getTime() { return time; }

    // ========== SETTERS ==========
    public void setId(Long id) { this.id = id; }
    public void setForwardedComplaint(ForwardedComplaint forwardedComplaint) { this.forwardedComplaint = forwardedComplaint; }
    public void setDecisionType(Decision decisionType) { this.decisionType = decisionType; }
    public void setEvidence(String evidence) { this.evidence = evidence; }
    public void setDescription(String description) { this.description = description; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setTime(LocalTime time) { this.time = time; }

    // ========== BUILDER PATTERN ==========
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private ForwardedComplaint forwardedComplaint;
        private Decision decisionType;
        private String evidence;
        private String description;
        private LocalDate date;
        private LocalTime time;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder forwardedComplaint(ForwardedComplaint forwardedComplaint) { this.forwardedComplaint = forwardedComplaint; return this; }
        public Builder decisionType(Decision decisionType) { this.decisionType = decisionType; return this; }
        public Builder evidence(String evidence) { this.evidence = evidence; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder time(LocalTime time) { this.time = time; return this; }

        public ForwardDecision build() {
            return new ForwardDecision(id, forwardedComplaint, decisionType, evidence, description, date, time);
        }
    }
}