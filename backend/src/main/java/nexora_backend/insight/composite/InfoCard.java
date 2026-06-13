package nexora_backend.insight.composite;

import java.util.List;

public class InfoCard implements CivicComponent {
    private String title;
    private String category;
    private List<CivicComponent> children;

    // Constructor injection — children passed at creation
    public InfoCard(String title, String category, List<CivicComponent> children) {
        this.title = title;
        this.category = category;
        this.children = children;
    }

    @Override
    public String getTitle() { return title; }

    @Override
    public String getCategory() { return category; }

    @Override
    public String getData() { 
        return children.size() + " items"; 
    }

    @Override
    public boolean isComposite() { return true; } // HAS children

    @Override
    public List<CivicComponent> getChildren() { 
        return children; // RETURNS actual children
    }

    @Override
    public String render() {
        StringBuilder sb = new StringBuilder();
        sb.append("[").append(title).append("]\n");
        for (CivicComponent child : children) {
            sb.append("  ").append(child.render()).append("\n");
        }
        return sb.toString();
    }
}