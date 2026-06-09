package nexora_backend.helpdesk.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SOSResponse {

    private Long sosId;

    private String message;

    private String status;
}