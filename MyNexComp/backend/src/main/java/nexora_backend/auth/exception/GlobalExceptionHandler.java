package nexora_backend.auth.exception;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice(basePackages = "nexora_backend.auth")
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<Map<String, Object>> handleAuthException(AuthException ex, HttpServletRequest request) {
        if (ex.getStatus().is5xxServerError()) {
            log.error("Auth error [{}] at {}: {}", ex.getCode(), request.getRequestURI(), ex.getMessage(), ex);
        }
        return AuthErrorResponse.from(ex, request.getRequestURI());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.INVALID_CREDENTIALS,
                "The password you entered is incorrect. Please try again or reset your password.",
                request.getRequestURI(),
                "password",
                null,
                null
        );
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.FORBIDDEN,
                AuthErrorCode.ACCESS_DENIED,
                "You do not have permission to perform this action.",
                request.getRequestURI(),
                null,
                null,
                null
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request
    ) {
        Map<String, String> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        error -> error.getDefaultMessage() == null ? "Invalid value" : error.getDefaultMessage(),
                        (first, second) -> first,
                        LinkedHashMap::new
                ));

        return AuthErrorResponse.entity(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.VALIDATION_FAILED,
                "Some fields are invalid. Please review the errors and try again.",
                request.getRequestURI(),
                fieldErrors.isEmpty() ? null : fieldErrors.keySet().iterator().next(),
                fieldErrors,
                null
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleMalformedBody(
            HttpMessageNotReadableException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.MALFORMED_REQUEST,
                "The request body is missing or malformed. Send valid JSON with all required fields.",
                request.getRequestURI(),
                null,
                null,
                null
        );
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, Object>> handleMissingParameter(
            MissingServletRequestParameterException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.VALIDATION_FAILED,
                "Required request parameter '" + ex.getParameterName() + "' is missing.",
                request.getRequestURI(),
                ex.getParameterName(),
                Map.of(ex.getParameterName(), "This parameter is required"),
                null
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(
            MethodArgumentTypeMismatchException ex,
            HttpServletRequest request
    ) {
        String field = ex.getName();
        return AuthErrorResponse.entity(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.VALIDATION_FAILED,
                "Invalid value for parameter '" + field + "'.",
                request.getRequestURI(),
                field,
                Map.of(field, "Invalid value"),
                null
        );
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.METHOD_NOT_ALLOWED,
                AuthErrorCode.BAD_REQUEST,
                "HTTP method " + ex.getMethod() + " is not supported for this endpoint.",
                request.getRequestURI(),
                null,
                null,
                null
        );
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleUnsupportedMediaType(
            HttpMediaTypeNotSupportedException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                AuthErrorCode.BAD_REQUEST,
                "Unsupported content type. Send requests as application/json.",
                request.getRequestURI(),
                null,
                null,
                null
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(
            NoResourceFoundException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.NOT_FOUND,
                AuthErrorCode.BAD_REQUEST,
                "The requested endpoint was not found.",
                request.getRequestURI(),
                null,
                null,
                null
        );
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<Map<String, Object>> handleJwtException(
            JwtException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.INVALID_REFRESH_TOKEN,
                "The provided token is invalid or expired. Please log in again.",
                request.getRequestURI(),
                null,
                null,
                null
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(
            IllegalArgumentException ex,
            HttpServletRequest request
    ) {
        return AuthErrorResponse.entity(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.BAD_REQUEST,
                ex.getMessage() == null ? "Invalid request value." : ex.getMessage(),
                request.getRequestURI(),
                null,
                null,
                null
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Unexpected auth error at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return AuthErrorResponse.entity(
                HttpStatus.INTERNAL_SERVER_ERROR,
                AuthErrorCode.INTERNAL_ERROR,
                "An unexpected error occurred. Please try again later.",
                request.getRequestURI(),
                null,
                null,
                null
        );
    }
}
