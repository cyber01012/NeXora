package nexora_backend.insight.model;

import java.util.List;

public class PowerSchedule {
    private List<String> slots;

    public PowerSchedule() {}

    public PowerSchedule(List<String> slots) {
        this.slots = slots;
    }

    public List<String> getSlots() { return slots; }
    public void setSlots(List<String> slots) { this.slots = slots; }
}