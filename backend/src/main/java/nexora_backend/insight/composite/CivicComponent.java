package nexora_backend.insight.composite;
import java.util.List;
public interface CivicComponent {
    String getTitle();
    String getCategory();
    String getData();
    boolean isComposite();
    List<CivicComponent> getChildren();
    String render();
}