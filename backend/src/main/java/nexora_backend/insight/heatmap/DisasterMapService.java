package nexora_backend.insight.heatmap;

import java.util.List;
import java.util.Map;

public interface DisasterMapService {
    List<Map<String, Object>> render();
}
