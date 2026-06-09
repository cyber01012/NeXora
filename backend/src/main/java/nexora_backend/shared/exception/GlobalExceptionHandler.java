//package nexora_backend.shared.exception;
//
//import nexora_backend.shared.dto.ApiResponse;     // ✅ ADD THIS
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(BusinessException.class)
//    public ResponseEntity<ApiResponse<Void>> handleBusiness(BusinessException ex) {
//        return ResponseEntity.status(ex.getStatus()).body(ApiResponse.error(ex.getMessage()));
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
//        String message = ex.getBindingResult().getFieldErrors().stream()
//                .findFirst()
//                .map(err -> err.getField() + ": " + err.getDefaultMessage())
//                .orElse("Validation failed");
//        return ResponseEntity.badRequest().body(ApiResponse.error(message));
//    }
//
//    @ExceptionHandler(IllegalStateException.class)
//    public ResponseEntity<ApiResponse<Void>> handleIllegalState(IllegalStateException ex) {
//        return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                .body(ApiResponse.error("Internal server error: " + ex.getMessage()));
//    }
//}