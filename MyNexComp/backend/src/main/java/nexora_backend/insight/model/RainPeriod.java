package nexora_backend.insight.model;

public class RainPeriod {
    private String start;
    private String end;
    private int maxChance;

    public RainPeriod(String start, String end, int maxChance) {
        this.start = start;
        this.end = end;
        this.maxChance = maxChance;
    }

    public String getStart() { return start; }
    public String getEnd() { return end; }
    public int getMaxChance() { return maxChance; }
}
