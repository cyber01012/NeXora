package nexora_backend.worker.dto.response;

import java.math.BigDecimal;
import java.util.List;

/**
 * Response DTO for the Worker Performance endpoint.
 * Computed dynamically from ForwardedComplaint data.
 */
public class WorkerPerformanceResponse {

    private String workerId;
    private int totalTasks;
    private int completedTasks;
    private int rejectedTasks;
    private int pendingTasks;
    private int inProgressTasks;
    private double completionRate;
    private BigDecimal rating;
    private BigDecimal avgResponseTimeMinutes;
    private BigDecimal avgCompletionTimeHours;
    private List<Integer> monthlyCompleted;

    public WorkerPerformanceResponse() {}

    public String getWorkerId()                          { return workerId; }
    public int getTotalTasks()                           { return totalTasks; }
    public int getCompletedTasks()                       { return completedTasks; }
    public int getRejectedTasks()                        { return rejectedTasks; }
    public int getPendingTasks()                         { return pendingTasks; }
    public int getInProgressTasks()                      { return inProgressTasks; }
    public double getCompletionRate()                    { return completionRate; }
    public BigDecimal getRating()                        { return rating; }
    public BigDecimal getAvgResponseTimeMinutes()        { return avgResponseTimeMinutes; }
    public BigDecimal getAvgCompletionTimeHours()        { return avgCompletionTimeHours; }
    public List<Integer> getMonthlyCompleted()           { return monthlyCompleted; }

    public void setWorkerId(String v)                   { this.workerId = v; }
    public void setTotalTasks(int v)                    { this.totalTasks = v; }
    public void setCompletedTasks(int v)                { this.completedTasks = v; }
    public void setRejectedTasks(int v)                 { this.rejectedTasks = v; }
    public void setPendingTasks(int v)                  { this.pendingTasks = v; }
    public void setInProgressTasks(int v)               { this.inProgressTasks = v; }
    public void setCompletionRate(double v)             { this.completionRate = v; }
    public void setRating(BigDecimal v)                 { this.rating = v; }
    public void setAvgResponseTimeMinutes(BigDecimal v) { this.avgResponseTimeMinutes = v; }
    public void setAvgCompletionTimeHours(BigDecimal v) { this.avgCompletionTimeHours = v; }
    public void setMonthlyCompleted(List<Integer> v)    { this.monthlyCompleted = v; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String workerId;
        private int totalTasks, completedTasks, rejectedTasks, pendingTasks, inProgressTasks;
        private double completionRate;
        private BigDecimal rating, avgResponseTimeMinutes, avgCompletionTimeHours;
        private List<Integer> monthlyCompleted;

        public Builder workerId(String v)                   { this.workerId = v; return this; }
        public Builder totalTasks(int v)                    { this.totalTasks = v; return this; }
        public Builder completedTasks(int v)                { this.completedTasks = v; return this; }
        public Builder rejectedTasks(int v)                 { this.rejectedTasks = v; return this; }
        public Builder pendingTasks(int v)                  { this.pendingTasks = v; return this; }
        public Builder inProgressTasks(int v)               { this.inProgressTasks = v; return this; }
        public Builder completionRate(double v)             { this.completionRate = v; return this; }
        public Builder rating(BigDecimal v)                 { this.rating = v; return this; }
        public Builder avgResponseTimeMinutes(BigDecimal v) { this.avgResponseTimeMinutes = v; return this; }
        public Builder avgCompletionTimeHours(BigDecimal v) { this.avgCompletionTimeHours = v; return this; }
        public Builder monthlyCompleted(List<Integer> v)    { this.monthlyCompleted = v; return this; }

        public WorkerPerformanceResponse build() {
            WorkerPerformanceResponse r = new WorkerPerformanceResponse();
            r.workerId = workerId; r.totalTasks = totalTasks;
            r.completedTasks = completedTasks; r.rejectedTasks = rejectedTasks;
            r.pendingTasks = pendingTasks; r.inProgressTasks = inProgressTasks;
            r.completionRate = completionRate; r.rating = rating;
            r.avgResponseTimeMinutes = avgResponseTimeMinutes;
            r.avgCompletionTimeHours = avgCompletionTimeHours;
            r.monthlyCompleted = monthlyCompleted;
            return r;
        }
    }
}
