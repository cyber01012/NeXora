package nexora_backend.auth.model;

import java.util.Locale;

public enum SystemRole {
    CITIZEN,
    NGO,
    RESPONDER,
    HELP_DESK,
    ASSIGNING_OFFICER,
    VOLUNTEER,
    WORKER,
    ADMIN;

    public static SystemRole fromUserTypeName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("User type name is required");
        }
        String normalized = name.trim()
                .toUpperCase(Locale.ROOT)
                .replace(' ', '_');
        return SystemRole.valueOf(normalized);
    }

    public String authority() {
        return "ROLE_" + name();
    }
}
