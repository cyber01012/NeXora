package nexora_backend.shared.util;

import jakarta.servlet.http.HttpServletRequest;
import nexora_backend.auth.model.AuthenticatedUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class RequestContext {

    private static final String RESPONDER_HEADER = "X-Responder-Username";
    private static final String CITIZEN_HEADER = "X-Citizen-Id";
    private static final String WORKER_HEADER = "X-Worker-Username";

    /**
     * Returns the currently authenticated username from the JWT principal.
     * Falls back to the custom header (for Postman/testing), then to a hardcoded default.
     */
    private String getPrincipalUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AuthenticatedUser user) {
            return user.getIdentifier();
        }
        return null;
    }

    public String getResponderUsername() {
        // 1. JWT principal (real logged-in user)
        String fromJwt = getPrincipalUsername();
        if (fromJwt != null && !fromJwt.isBlank()) {
            return fromJwt;
        }
        // 2. Header fallback (Postman / legacy)
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            String header = attrs.getRequest().getHeader(RESPONDER_HEADER);
            if (header != null && !header.isBlank()) {
                return header;
            }
        }
        // 3. Hardcoded default (dev only)
        return "kelectric_fp";
    }

    public Long getCitizenId() {
        // Citizens use a numeric ID, not username — keep header-based approach
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return 1L;
        }
        HttpServletRequest request = attrs.getRequest();

        // Try JWT principal's sourceId first
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AuthenticatedUser user) {
            try {
                return Long.parseLong(user.getSourceId());
            } catch (NumberFormatException ignored) {}
        }

        // Fall back to header
        String citizenId = request.getHeader(CITIZEN_HEADER);
        if (citizenId == null || citizenId.isBlank()) {
            return 1L;
        }
        try {
            return Long.parseLong(citizenId);
        } catch (NumberFormatException e) {
            return 1L;
        }
    }

    public Long getCitizenIdOrDefault(Long defaultId) {
        Long id = getCitizenId();
        return id != null ? id : defaultId;
    }

    public String getWorkerUsername() {
        // 1. JWT principal (real logged-in user)
        String fromJwt = getPrincipalUsername();
        if (fromJwt != null && !fromJwt.isBlank()) {
            return fromJwt;
        }
        // 2. Header fallback (Postman / legacy)
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs != null) {
            String header = attrs.getRequest().getHeader(WORKER_HEADER);
            if (header != null && !header.isBlank()) {
                return header;
            }
        }
        // 3. Hardcoded default (dev only)
        return "worker_default";
    }
}