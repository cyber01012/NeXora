package nexora_backend.shared.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class RequestContext {

    private static final String RESPONDER_HEADER = "X-Responder-Username";
    private static final String CITIZEN_HEADER = "X-Citizen-Id";

    public String getResponderUsername() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return "kelectric_fp"; // ✅ DEFAULT for testing
        }
        HttpServletRequest request = attrs.getRequest();
        String username = request.getHeader(RESPONDER_HEADER);

        // ✅ If header missing, return default
        if (username == null || username.isBlank()) {
            return "kelectric_fp";
        }
        return username;
    }

    public Long getCitizenId() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return 1L; // ✅ DEFAULT for testing
        }
        HttpServletRequest request = attrs.getRequest();
        String citizenId = request.getHeader(CITIZEN_HEADER);

        // ✅ If header missing, return default
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

    private static final String WORKER_HEADER = "X-Worker-Username";

    public String getWorkerUsername() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return "worker_default"; // ✅ DEFAULT for testing
        }
        HttpServletRequest request = attrs.getRequest();
        String username = request.getHeader(WORKER_HEADER);

        if (username == null || username.isBlank()) {
            return "worker_default";
        }
        return username;
    }
}