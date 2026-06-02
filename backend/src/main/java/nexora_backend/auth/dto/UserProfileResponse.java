package nexora_backend.auth.dto;

import lombok.Builder;
import lombok.Getter;
import nexora_backend.auth.model.CitizenBadge;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;

@Getter
@Builder
public class UserProfileResponse {

    private final String identifier;
    private final String sourceId;
    private final UserSource source;
    private final SystemRole role;
    private final String displayName;
    private final String email;
    private final String maskedPhone;
    private final String maskedCnic;
    private final Boolean active;
    private final Boolean emailVerified;
    private final Boolean cnicValidated;
    private final CitizenBadge citizenBadge;
}
