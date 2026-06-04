package nexora_backend.responder.entity;

import jakarta.persistence.*;
import nexora_backend.citizen.entity.CitizenReport;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.Department;
import nexora_backend.database.entity.ForwardedComplaint;
import java.time.LocalDateTime;

@Entity
@Table(name = "department_task")
public class DepartmentTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forwarded_complaint_id", nullable = false)
    private ForwardedComplaint forwardedComplaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private CitizenReport report;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responder_username", referencedColumnName = "username", nullable = false)
    private AdminUser responder;

    @Column(length = 30)
    private String status = "PENDING_RESPONDER";

    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // ========== GETTERS ==========
    public Long getId() { return id; }
    public ForwardedComplaint getForwardedComplaint() { return forwardedComplaint; }
    public CitizenReport getReport() { return report; }
    public Department getDepartment() { return department; }
    public AdminUser getResponder() { return responder; }
    public String getStatus() { return status; }
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public String getRejectionReason() { return rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ========== SETTERS ==========
    public void setId(Long id) { this.id = id; }
    public void setForwardedComplaint(ForwardedComplaint forwardedComplaint) { this.forwardedComplaint = forwardedComplaint; }
    public void setReport(CitizenReport report) { this.report = report; }
    public void setDepartment(Department department) { this.department = department; }
    public void setResponder(AdminUser responder) { this.responder = responder; }
    public void setStatus(String status) { this.status = status; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}