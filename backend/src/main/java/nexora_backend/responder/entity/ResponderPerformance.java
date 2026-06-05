//package nexora_backend.responder.entity;
//
//import jakarta.persistence.*;
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "responder_performance")
//public class ResponderPerformance {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "responder_id", nullable = false, unique = true, length = 50)
//    private String responderId;
//
//    @Column(name = "total_tasks")
//    private Integer totalTasks = 0;
//
//    @Column(name = "completed_tasks")
//    private Integer completedTasks = 0;
//
//    @Column(name = "rejected_tasks")
//    private Integer rejectedTasks = 0;
//
//    @Column(name = "avg_response_time_minutes", precision = 10, scale = 2)
//    private BigDecimal avgResponseTimeMinutes = BigDecimal.ZERO;
//
//    @Column(name = "avg_completion_time_hours", precision = 10, scale = 2)
//    private BigDecimal avgCompletionTimeHours = BigDecimal.ZERO;
//
//    @Column(precision = 3, scale = 2)
//    private BigDecimal rating = BigDecimal.ZERO;
//
//    @Column(name = "last_updated")
//    private LocalDateTime lastUpdated;
//
//    @PrePersist
//    @PreUpdate
//    protected void onUpdate() {
//        lastUpdated = LocalDateTime.now();
//    }
//
//    // ========== GETTERS ==========
//    public Long getId() { return id; }
//    public String getResponderId() { return responderId; }
//    public Integer getTotalTasks() { return totalTasks; }
//    public Integer getCompletedTasks() { return completedTasks; }
//    public Integer getRejectedTasks() { return rejectedTasks; }
//    public BigDecimal getAvgResponseTimeMinutes() { return avgResponseTimeMinutes; }
//    public BigDecimal getAvgCompletionTimeHours() { return avgCompletionTimeHours; }
//    public BigDecimal getRating() { return rating; }
//    public LocalDateTime getLastUpdated() { return lastUpdated; }
//
//    // ========== SETTERS ==========
//    public void setId(Long id) { this.id = id; }
//    public void setResponderId(String responderId) { this.responderId = responderId; }
//    public void setTotalTasks(Integer totalTasks) { this.totalTasks = totalTasks; }
//    public void setCompletedTasks(Integer completedTasks) { this.completedTasks = completedTasks; }
//    public void setRejectedTasks(Integer rejectedTasks) { this.rejectedTasks = rejectedTasks; }
//    public void setAvgResponseTimeMinutes(BigDecimal avgResponseTimeMinutes) { this.avgResponseTimeMinutes = avgResponseTimeMinutes; }
//    public void setAvgCompletionTimeHours(BigDecimal avgCompletionTimeHours) { this.avgCompletionTimeHours = avgCompletionTimeHours; }
//    public void setRating(BigDecimal rating) { this.rating = rating; }
//    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
//}