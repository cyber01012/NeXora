package nexora_backend.auth.pattern.strategy;

import lombok.Builder;
import lombok.Getter;
import nexora_backend.auth.dto.AdminUserRegistrationRequest;
import nexora_backend.auth.dto.CitizenRegistrationRequest;
import nexora_backend.auth.dto.VolunteerWorkerRegistrationRequest;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;

/**
 * Context object passed to a {@link RegistrationStrategy} implementation.
 */
@Getter
@Builder
public class RegistrationContext {

    private final SystemRole targetRole;
    private final AuthenticatedUser creator;
    private final CitizenRegistrationRequest citizenRequest;
    private final AdminUserRegistrationRequest adminUserRequest;
    private final VolunteerWorkerRegistrationRequest volunteerWorkerRequest;

    public static RegistrationContext forCitizen(CitizenRegistrationRequest request) {
        return RegistrationContext.builder()
                .targetRole(SystemRole.CITIZEN)
                .citizenRequest(request)
                .build();
    }

    public static RegistrationContext forAdminPortal(
            SystemRole targetRole,
            AdminUserRegistrationRequest request,
            AuthenticatedUser creator
    ) {
        return RegistrationContext.builder()
                .targetRole(targetRole)
                .adminUserRequest(request)
                .creator(creator)
                .build();
    }

    public static RegistrationContext forVolunteer(
            VolunteerWorkerRegistrationRequest request,
            AuthenticatedUser creator
    ) {
        return RegistrationContext.builder()
                .targetRole(SystemRole.VOLUNTEER)
                .volunteerWorkerRequest(request)
                .creator(creator)
                .build();
    }

    public static RegistrationContext forWorker(
            VolunteerWorkerRegistrationRequest request,
            AuthenticatedUser creator
    ) {
        return RegistrationContext.builder()
                .targetRole(SystemRole.WORKER)
                .volunteerWorkerRequest(request)
                .creator(creator)
                .build();
    }
}
