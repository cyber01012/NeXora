package nexora_backend.insight.composite;
import java.util.ArrayList;
import java.util.List;
public class DataLeaf implements CivicComponent {
    private String title;
    private String category;
    private String data;

    public DataLeaf(String title, String category, String data) {
        this.title = title;
        this.category = category;
        this.data = data;
    }
    @Override
    public String getTitle() { return title; }
    @Override
    public String getCategory() { return category; }
    @Override
    public String getData() { return data; }
    @Override
    public boolean isComposite() { return false; }
    @Override
    public List<CivicComponent> getChildren() { 
        return new ArrayList<>(); // EMPTY — leaf has no children
    }
    @Override
    public String render() { 
        return title + ": " + data; 
    }
}