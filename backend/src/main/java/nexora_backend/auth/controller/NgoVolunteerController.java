package nexora_backend.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.RegistrationResponse;
import nexora_backend.auth.dto.VolunteerWorkerRegistrationRequest;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.pattern.facade.AuthenticationFacade;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ngo/volunteers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('NGO')")
public class NgoVolunteerController {

    private final AuthenticationFacade authenticationFacade;

    @PostMapping
    public ResponseEntity<RegistrationResponse> createVolunteer(
            @AuthenticationPrincipal AuthenticatedUser ngoUser,
            @Valid @RequestBody VolunteerWorkerRegistrationRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authenticationFacade.registerVolunteer(request, ngoUser));
    }
}
