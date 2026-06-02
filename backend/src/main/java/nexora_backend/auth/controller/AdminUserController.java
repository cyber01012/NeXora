package nexora_backend.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.AdminUserRegistrationRequest;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.pattern.facade.AuthenticationFacade;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AuthenticationFacade authenticationFacade;

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
}
