package nexora_backend.auth.exception;

import lombok.Builder;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

@Getter
@Builder
public class AuthErrorResponse {

    private final String timestamp;
    private final int status;
    private final String error;
    private final String code;
    private final String message;
    private final String path;
    private final String field;
    private final Map<String, String> errors;
    private final Map<String, Object> details;

    public static ResponseEntity<Map<String, Object>> entity(
            HttpStatus status,
            AuthErrorCode code,
            String message,
            String path,
            String field,
            Map<String, String> errors,
            Map<String, Object> details
    ) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("code", code.name());
        body.put("message", message);
        if (path != null) {
            body.put("path", path);
        }
        if (field != null) {
            body.put("field", field);
        }
        if (errors != null && !errors.isEmpty()) {
            body.put("errors", errors);
        }
        if (details != null && !details.isEmpty()) {
            body.put("details", details);
        }
        return ResponseEntity.status(status).body(body);
    }

    public static ResponseEntity<Map<String, Object>> from(AuthException ex, String path) {
        return entity(
                ex.getStatus(),
                ex.getCode(),
                ex.getMessage(),
                path,
                ex.getField(),
                null,
                ex.getDetails().isEmpty() ? null : ex.getDetails()
        );
    }

    public static Map<String, Object> emptyDetails() {
        return Collections.emptyMap();
    }
}
