package nexora_backend.citizen.dto.response;

import java.util.Map;

public class StatsResponse {

    private long totalReports;
    private long pending;
    private long inProgress;
    private long completed;
    private Map<String, Long> byType;

    // Getters
    public long getTotalReports() { return totalReports; }
    public long getPending() { return pending; }
    public long getInProgress() { return inProgress; }
    public long getCompleted() { return completed; }
    public Map<String, Long> getByType() { return byType; }

    // Builder
    public static StatsResponseBuilder builder() { return new StatsResponseBuilder(); }

    public static class StatsResponseBuilder {
        private long totalReports;
        private long pending;
        private long inProgress;
        private long completed;
        private Map<String, Long> byType;

        public StatsResponseBuilder totalReports(long totalReports) { this.totalReports = totalReports; return this; }
        public StatsResponseBuilder pending(long pending) { this.pending = pending; return this; }
        public StatsResponseBuilder inProgress(long inProgress) { this.inProgress = inProgress; return this; }
        public StatsResponseBuilder completed(long completed) { this.completed = completed; return this; }
        public StatsResponseBuilder byType(Map<String, Long> byType) { this.byType = byType; return this; }

        public StatsResponse build() {
            StatsResponse r = new StatsResponse();
            r.totalReports = this.totalReports;
            r.pending = this.pending;
            r.inProgress = this.inProgress;
            r.completed = this.completed;
            r.byType = this.byType;
            return r;
        }
    }
}