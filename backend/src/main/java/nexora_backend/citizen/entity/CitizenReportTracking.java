//package nexora_backend.citizen.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "citizen_report_tracking")
//public class CitizenReportTracking {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "report_id", nullable = false)
//    private CitizenReport report;
//
//    @Column(nullable = false, length = 30)
//    private String status;
//
//    @Column(columnDefinition = "TEXT")
//    private String notes;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    // Manual getters & setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public CitizenReport getReport() { return report; }
//    public void setReport(CitizenReport report) { this.report = report; }
//
//    public String getStatus() { return status; }
//    public void setStatus(String status) { this.status = status; }
//
//    public String getNotes() { return notes; }
//    public void setNotes(String notes) { this.notes = notes; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//}