package nexora_backend.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResendOtpResponse {

    private final String message;
    private final int remainingResends;
}
