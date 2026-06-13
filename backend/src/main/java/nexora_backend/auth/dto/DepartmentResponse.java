package nexora_backend.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DepartmentResponse {

    private final Long id;
    private final String name;
    private final String responderTypeCategory;
    private final String responderTypeName;
}
