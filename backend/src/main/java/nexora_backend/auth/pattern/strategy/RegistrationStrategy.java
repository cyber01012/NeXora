package nexora_backend.auth.pattern.strategy;

import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.model.SystemRole;

/**
 * Strategy Pattern — defines a family of registration algorithms, one per role.
 */
public interface RegistrationStrategy {

    SystemRole supportedRole();

    RegistrationResponse register(RegistrationContext context);
}
