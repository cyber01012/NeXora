package nexora_backend.responder.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "responder_task_history")
public class ResponderTaskHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "task_id", nullable = false)
    private Long taskId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "performed_by", length = 50)
    private String performedBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static ResponderTaskHistoryBuilder builder() { return new ResponderTaskHistoryBuilder(); }

    public static class ResponderTaskHistoryBuilder {
        private Long id;
        private Long taskId;
        private String action;
        private String performedBy;
        private String notes;
        private LocalDateTime createdAt;

        public ResponderTaskHistoryBuilder id(Long id) { this.id = id; return this; }
        public ResponderTaskHistoryBuilder taskId(Long taskId) { this.taskId = taskId; return this; }
        public ResponderTaskHistoryBuilder action(String action) { this.action = action; return this; }
        public ResponderTaskHistoryBuilder performedBy(String performedBy) { this.performedBy = performedBy; return this; }
        public ResponderTaskHistoryBuilder notes(String notes) { this.notes = notes; return this; }
        public ResponderTaskHistoryBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ResponderTaskHistory build() {
            ResponderTaskHistory history = new ResponderTaskHistory();
            history.id = this.id;
            history.taskId = this.taskId;
            history.action = this.action;
            history.performedBy = this.performedBy;
            history.notes = this.notes;
            history.createdAt = this.createdAt;
            return history;
        }
    }
}