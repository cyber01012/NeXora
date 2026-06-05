package nexora_backend.responder.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PerformanceResponse {
    private String responderId;
    private Integer totalTasks;
    private Integer completedTasks;
    private Integer rejectedTasks;
    private BigDecimal avgResponseTimeMinutes;
    private BigDecimal avgCompletionTimeHours;
    private BigDecimal rating;
    private LocalDateTime lastUpdated;

    // ========== CONSTRUCTORS ==========
    public PerformanceResponse() {}

    public PerformanceResponse(String responderId, Integer totalTasks, Integer completedTasks,
                               Integer rejectedTasks, BigDecimal avgResponseTimeMinutes,
                               BigDecimal avgCompletionTimeHours, BigDecimal rating,
                               LocalDateTime lastUpdated) {
        this.responderId = responderId;
        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.rejectedTasks = rejectedTasks;
        this.avgResponseTimeMinutes = avgResponseTimeMinutes;
        this.avgCompletionTimeHours = avgCompletionTimeHours;
        this.rating = rating;
        this.lastUpdated = lastUpdated;
    }

    // ========== GETTERS ==========
    public String getResponderId() { return responderId; }
    public Integer getTotalTasks() { return totalTasks; }
    public Integer getCompletedTasks() { return completedTasks; }
    public Integer getRejectedTasks() { return rejectedTasks; }
    public BigDecimal getAvgResponseTimeMinutes() { return avgResponseTimeMinutes; }
    public BigDecimal getAvgCompletionTimeHours() { return avgCompletionTimeHours; }
    public BigDecimal getRating() { return rating; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }

    // ========== SETTERS ==========
    public void setResponderId(String responderId) { this.responderId = responderId; }
    public void setTotalTasks(Integer totalTasks) { this.totalTasks = totalTasks; }
    public void setCompletedTasks(Integer completedTasks) { this.completedTasks = completedTasks; }
    public void setRejectedTasks(Integer rejectedTasks) { this.rejectedTasks = rejectedTasks; }
    public void setAvgResponseTimeMinutes(BigDecimal avgResponseTimeMinutes) { this.avgResponseTimeMinutes = avgResponseTimeMinutes; }
    public void setAvgCompletionTimeHours(BigDecimal avgCompletionTimeHours) { this.avgCompletionTimeHours = avgCompletionTimeHours; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

    // ========== BUILDER PATTERN ==========
    public static PerformanceResponseBuilder builder() {
        return new PerformanceResponseBuilder();
    }

    public static class PerformanceResponseBuilder {
        private String responderId;
        private Integer totalTasks;
        private Integer completedTasks;
        private Integer rejectedTasks;
        private BigDecimal avgResponseTimeMinutes;
        private BigDecimal avgCompletionTimeHours;
        private BigDecimal rating;
        private LocalDateTime lastUpdated;

        public PerformanceResponseBuilder responderId(String responderId) { this.responderId = responderId; return this; }
        public PerformanceResponseBuilder totalTasks(Integer totalTasks) { this.totalTasks = totalTasks; return this; }
        public PerformanceResponseBuilder completedTasks(Integer completedTasks) { this.completedTasks = completedTasks; return this; }
        public PerformanceResponseBuilder rejectedTasks(Integer rejectedTasks) { this.rejectedTasks = rejectedTasks; return this; }
        public PerformanceResponseBuilder avgResponseTimeMinutes(BigDecimal avgResponseTimeMinutes) { this.avgResponseTimeMinutes = avgResponseTimeMinutes; return this; }
        public PerformanceResponseBuilder avgCompletionTimeHours(BigDecimal avgCompletionTimeHours) { this.avgCompletionTimeHours = avgCompletionTimeHours; return this; }
        public PerformanceResponseBuilder rating(BigDecimal rating) { this.rating = rating; return this; }
        public PerformanceResponseBuilder lastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; return this; }

        public PerformanceResponse build() {
            return new PerformanceResponse(
                    responderId, totalTasks, completedTasks, rejectedTasks,
                    avgResponseTimeMinutes, avgCompletionTimeHours, rating, lastUpdated
            );
        }
        public void setAvgResponseTimeMinutes(BigDecimal avgResponseTimeMinutes) {
            this.avgResponseTimeMinutes = avgResponseTimeMinutes;
        }

        public void setAvgCompletionTimeHours(BigDecimal avgCompletionTimeHours) {
            this.avgCompletionTimeHours = avgCompletionTimeHours;
        }

        public void setRating(BigDecimal rating) {
            this.rating = rating;
        }
    }
}