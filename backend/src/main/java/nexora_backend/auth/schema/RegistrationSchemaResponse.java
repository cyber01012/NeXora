package nexora_backend.auth.schema;

import lombok.Builder;
import lombok.Getter;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.RegisterCitizen;
import nexora_backend.database.entity.VolunteerWorkerCreator;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Getter
@Builder
public class RegistrationSchemaResponse {

    private final String role;
    private final String entity;
    private final List<EntityFieldMetadata> fields;

    public static Map<String, RegistrationSchemaResponse> all() {
        Map<String, RegistrationSchemaResponse> schemas = new LinkedHashMap<>();
        schemas.put("CITIZEN", forEntity("CITIZEN", RegisterCitizen.class,
                Set.of("entryDate", "entryTime", "emailVerified", "cnicValidated")));
        schemas.put("NGO", forEntity("NGO", AdminUser.class,
                Set.of("active", "date", "time", "inactiveRemarks", "userType", "emailVerified", "department", "responderType")));
        schemas.put("HELP_DESK", forEntity("HELP_DESK", AdminUser.class,
                Set.of("active", "date", "time", "inactiveRemarks", "userType", "department", "responderType", "emailVerified")));
        schemas.put("ASSIGNING_OFFICER", forEntity("ASSIGNING_OFFICER", AdminUser.class,
                Set.of("active", "date", "time", "inactiveRemarks", "userType", "department", "responderType", "emailVerified")));
        schemas.put("RESPONDER", forEntity("RESPONDER", AdminUser.class,
                Set.of("active", "date", "time", "inactiveRemarks", "userType", "department", "emailVerified")));
        schemas.put("VOLUNTEER", forEntity("VOLUNTEER", VolunteerWorkerCreator.class,
                Set.of("active", "createdDate", "createdTime", "department", "userType", "emailVerified")));
        schemas.put("WORKER", forEntity("WORKER", VolunteerWorkerCreator.class,
                Set.of("active", "createdDate", "createdTime", "department", "userType", "emailVerified")));
        return schemas;
    }

    private static RegistrationSchemaResponse forEntity(
            String role,
            Class<?> entityClass,
            Set<String> excludedFields
    ) {
        return RegistrationSchemaResponse.builder()
                .role(role)
                .entity(entityClass.getSimpleName())
                .fields(EntityFieldMetadata.fromEntity(entityClass, excludedFields))
                .build();
    }
}
