package nexora_backend.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponderTypeResponse {

    private final String id;
    private final String name;
}
