package nexora_backend.auth.dto;

import lombok.Builder;
import lombok.Getter;
import nexora_backend.auth.model.UserSource;

@Getter
@Builder
public class PasswordResetInitResponse {

    private final String message;
    private final UserSource source;
    private final String sourceId;
}
