package nexora_backend.assigningofficer.mediator;

import nexora_backend.assigningofficer.dto.DispatchRequest;
import java.util.Map;

/**
 * Mediator interface that coordinates interactions between report resources (SOS, Civic)
 * and responder departments to dispatch assistance.
 */
public interface DispatchMediator {
    Map<String, Object> dispatch(String aoUsername, DispatchRequest request);
}
