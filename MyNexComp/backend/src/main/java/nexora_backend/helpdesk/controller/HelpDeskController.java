package nexora_backend.helpdesk.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.helpdesk.dto.SOSRequest;
import nexora_backend.helpdesk.dto.SOSResponse;
import nexora_backend.helpdesk.service.HelpDeskService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/helpdesk")
@RequiredArgsConstructor

@PreAuthorize("hasRole('HELP_DESK')")
public class HelpDeskController {

    private final HelpDeskService
            helpDeskService;

    /* =========================================
       DASHBOARD
    ========================================= */

    @GetMapping("/dashboard")
    public ResponseEntity<?> dashboard() {

        return ResponseEntity.ok(
                helpDeskService.getDashboard()
        );
    }

    /* =========================================
       CREATE SOS
    ========================================= */

    @PostMapping("/sos")
    public ResponseEntity<SOSResponse> createSOS(

            @Valid
            @RequestBody
            SOSRequest request,

            @AuthenticationPrincipal
            AuthenticatedUser user
    ) {

        return ResponseEntity.ok(

                helpDeskService.createSOS(
                        request,
                        user
                )
        );
    }

    /* =========================================
       RECENT REPORTS
    ========================================= */

    @GetMapping("/sos/recent")
    public ResponseEntity<?> recentSOS() {

        return ResponseEntity.ok(
                helpDeskService
                        .recentSOS()
        );
    }

    @GetMapping("/sos/natures")
    public ResponseEntity<?> sosNatures() {

        return ResponseEntity.ok(
                helpDeskService
                        .getSOSNatures()
        );
    }
}
