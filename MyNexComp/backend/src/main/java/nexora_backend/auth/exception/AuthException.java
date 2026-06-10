package nexora_backend.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.Map;

@Getter
public class AuthException extends RuntimeException {

    private final HttpStatus status;
    private final AuthErrorCode code;
    private final String field;
    private final Map<String, Object> details;

    public AuthException(HttpStatus status, String message) {
        this(status, AuthErrorCode.BAD_REQUEST, message, null, Collections.emptyMap());
    }

    public AuthException(HttpStatus status, String message, Map<String, Object> details) {
        this(status, AuthErrorCode.BAD_REQUEST, message, null, details);
    }

    public AuthException(HttpStatus status, AuthErrorCode code, String message) {
        this(status, code, message, null, Collections.emptyMap());
    }

    public AuthException(HttpStatus status, AuthErrorCode code, String message, String field) {
        this(status, code, message, field, Collections.emptyMap());
    }

    public AuthException(HttpStatus status, AuthErrorCode code, String message, Map<String, Object> details) {
        this(status, code, message, null, details);
    }

    public AuthException(
            HttpStatus status,
            AuthErrorCode code,
            String message,
            String field,
            Map<String, Object> details
    ) {
        super(message);
        this.status = status;
        this.code = code;
        this.field = field;
        this.details = details == null ? Collections.emptyMap() : details;
    }
}
