package nexora_backend.independent.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "responder_performance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponderPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "responder_id")
    private String responderId;

    @Column(name = "total_tasks")
    private Integer totalTasks = 0;

    @Column(name = "completed_tasks")
    private Integer completedTasks = 0;

    @Column(name = "rejected_tasks")
    private Integer rejectedTasks = 0;

    @Column(name = "avg_response_time_minutes")
    private BigDecimal avgResponseTimeMinutes;

    @Column(name = "avg_completion_time_hours")
    private BigDecimal avgCompletionTimeHours;

    private BigDecimal rating;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}