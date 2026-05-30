package nexora_backend.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.Map;

@Getter
public class AuthException extends RuntimeException {

    private final HttpStatus status;
    private final Map<String, Object> details;

    public AuthException(HttpStatus status, String message) {
        this(status, message, Collections.emptyMap());
    }

    public AuthException(HttpStatus status, String message, Map<String, Object> details) {
        super(message);
        this.status = status;
        this.details = details == null ? Collections.emptyMap() : details;
    }
}
