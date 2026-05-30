package nexora_backend.auth.pattern.factory;

import nexora_backend.auth.exception.AuthException;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.pattern.strategy.AdminPortalRegistrationStrategy;
import nexora_backend.auth.pattern.strategy.CitizenRegistrationStrategy;
import nexora_backend.auth.pattern.strategy.RegistrationStrategy;
import nexora_backend.auth.pattern.strategy.VolunteerRegistrationStrategy;
import nexora_backend.auth.pattern.strategy.WorkerRegistrationStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.EnumSet;

/**
 * Factory Pattern — creates/selects the correct {@link RegistrationStrategy} for a {@link SystemRole}.
 */
@Component
public class RegistrationStrategyFactory {

    private static final EnumSet<SystemRole> ADMIN_PORTAL_ROLES = EnumSet.of(
            SystemRole.NGO,
            SystemRole.HELP_DESK,
            SystemRole.ASSIGNING_OFFICER,
            SystemRole.RESPONDER
    );

    private final CitizenRegistrationStrategy citizenRegistrationStrategy;
    private final AdminPortalRegistrationStrategy adminPortalRegistrationStrategy;
    private final VolunteerRegistrationStrategy volunteerRegistrationStrategy;
    private final WorkerRegistrationStrategy workerRegistrationStrategy;

    public RegistrationStrategyFactory(
            CitizenRegistrationStrategy citizenRegistrationStrategy,
            AdminPortalRegistrationStrategy adminPortalRegistrationStrategy,
            VolunteerRegistrationStrategy volunteerRegistrationStrategy,
            WorkerRegistrationStrategy workerRegistrationStrategy
    ) {
        this.citizenRegistrationStrategy = citizenRegistrationStrategy;
        this.adminPortalRegistrationStrategy = adminPortalRegistrationStrategy;
        this.volunteerRegistrationStrategy = volunteerRegistrationStrategy;
        this.workerRegistrationStrategy = workerRegistrationStrategy;
    }

    public RegistrationStrategy getStrategy(SystemRole role) {
        if (role == SystemRole.CITIZEN) {
            return citizenRegistrationStrategy;
        }
        if (ADMIN_PORTAL_ROLES.contains(role)) {
            return adminPortalRegistrationStrategy;
        }
        if (role == SystemRole.VOLUNTEER) {
            return volunteerRegistrationStrategy;
        }
        if (role == SystemRole.WORKER) {
            return workerRegistrationStrategy;
        }
        throw new AuthException(HttpStatus.BAD_REQUEST, "No registration strategy for role: " + role);
    }
}
