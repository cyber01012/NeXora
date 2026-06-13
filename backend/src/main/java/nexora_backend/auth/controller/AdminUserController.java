package nexora_backend.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.*;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.pattern.facade.AuthenticationFacade;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.repository.AdminUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import nexora_backend.auth.util.EncryptionService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AuthenticationFacade authenticationFacade;
    private final EncryptionService encryptionService;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/ngo")
    public ResponseEntity<RegistrationResponse> createNgo(
            @AuthenticationPrincipal AuthenticatedUser admin,
            @Valid @RequestBody AdminUserRegistrationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authenticationFacade.registerAdminPortalUser(SystemRole.NGO, request, admin));
    }

    @PostMapping("/help-desk")
    public ResponseEntity<RegistrationResponse> createHelpDesk(
            @AuthenticationPrincipal AuthenticatedUser admin,
            @Valid @RequestBody AdminUserRegistrationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authenticationFacade.registerAdminPortalUser(SystemRole.HELP_DESK, request, admin));
    }

    @PostMapping("/assigning-officer")
    public ResponseEntity<RegistrationResponse> createAssigningOfficer(
            @AuthenticationPrincipal AuthenticatedUser admin,
            @Valid @RequestBody AdminUserRegistrationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authenticationFacade.registerAdminPortalUser(SystemRole.ASSIGNING_OFFICER, request, admin));
    }

    @PostMapping("/responder")
    public ResponseEntity<RegistrationResponse> createResponder(
            @AuthenticationPrincipal AuthenticatedUser admin,
            @Valid @RequestBody AdminUserRegistrationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authenticationFacade.registerAdminPortalUser(SystemRole.RESPONDER, request, admin));
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getUsers() {

        List<AdminUserResponse> users =
                adminUserRepository.findAll()
                        .stream()
                        .filter(user ->
                                user.getUserType() == null
                                        || !user.getUserType()
                                        .getName()
                                        .equalsIgnoreCase("ADMIN")
                        )
                        .map(user -> AdminUserResponse.builder()

                                .username(user.getUsername())

                                .name(user.getName())

                                .email(user.getEmail())

                                .contactNumber(
                                        encryptionService.decrypt(
                                                user.getContactNumber()
                                        )
                                )

                                .active(user.getActive())

                                .inactiveRemarks(
                                        user.getInactiveRemarks()
                                )

                                .category(user.getCategory())

                                .deptName(
                                        user.getDepartment() != null
                                                ? user.getDepartment().getDeptName()
                                                : null
                                )

                                .userType(
                                        user.getUserType() != null
                                                ? user.getUserType().getName()
                                                : null
                                )

                                .build())

                        .toList();

        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String username
    ) {

        AdminUser user = adminUserRepository
                .findById(username)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (
                user.getUserType() != null
                        && user.getUserType()
                        .getName()
                        .equalsIgnoreCase("ADMIN")
        ) {
            return ResponseEntity.badRequest()
                    .body("System administrator cannot be deleted.");
        }

        adminUserRepository.delete(user);

        return ResponseEntity.ok(
                "User removed successfully."
        );
    }

    @PutMapping("/{username}/reset-password")
    public ResponseEntity<?> resetUserPassword(

            @PathVariable String username,

            @Valid @RequestBody AdminPasswordResetRequest request
    ) {

        AdminUser user =
                adminUserRepository
                        .findById(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        adminUserRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse(
                        "Password reset successfully."
                )
        );
    }

    @PutMapping("/{username}")
    public ResponseEntity<?> updateUser(

            @PathVariable String username,

            @RequestBody UpdateUserRequest request
    ) {

        AdminUser user =
                adminUserRepository
                        .findById(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        user.setName(request.getName());

        user.setEmail(request.getEmail());

        user.setContactNumber(
                encryptionService.encrypt(
                        request.getContactNumber()
                )
        );

        user.setActive(request.getActive());

        user.setInactiveRemarks(
                request.getInactiveRemarks()
        );

        adminUserRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse(
                        "User updated successfully."
                )
        );
    }
}
