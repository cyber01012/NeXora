package nexora_backend.insight.composite;
import java.util.List;
public class AreaDashboard implements CivicComponent {
    private String regionName;
    private List<CivicComponent> cards;
    public AreaDashboard(String regionName, List<CivicComponent> cards) {
        this.regionName = regionName;
        this.cards = cards;
    }
    @Override
    public String getTitle() { return regionName; }
    @Override
    public String getCategory() { return "dashboard"; }
    @Override
    public String getData() { 
        return cards.size() + " cards"; 
    }
    @Override
    public boolean isComposite() { return true; }
    @Override
    public List<CivicComponent> getChildren() { 
        return cards; 
    }
    @Override
    public String render() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== ").append(regionName).append(" ===\n");
        for (CivicComponent card : cards) {
            sb.append(card.render()).append("\n");
        }
        return sb.toString();
    }
}