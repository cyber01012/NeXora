//package nexora_backend.auth.controller;
//
//import nexora_backend.auth.dto.request.ChangePasswordRequest;
//import nexora_backend.auth.service.AuthService;
//import nexora_backend.shared.dto.ApiResponse;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    private final AuthService authService;
//
//    public AuthController(AuthService authService) {
//        this.authService = authService;
//    }
//
//    // ✅ ADD THIS ENDPOINT
//    @PostMapping("/change-password")
//    public ApiResponse<Void> changePassword(@RequestBody ChangePasswordRequest request,
//                                            @RequestHeader(value = "X-Citizen-Id", required = false) Long citizenId) {
//        authService.changePassword(citizenId, request);
//        return ApiResponse.okMessage("Password changed successfully");
//    }
//}