package nexora_backend.insight.heatmap;

import java.util.List;
import java.util.Map;

public interface MapAPI {
    // UML specifies void, but we return data for the frontend REST API
    List<Map<String, Object>> drawHeat();
}
