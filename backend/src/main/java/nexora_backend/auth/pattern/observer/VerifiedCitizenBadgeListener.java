package nexora_backend.auth.pattern.observer;

import lombok.extern.slf4j.Slf4j;
import nexora_backend.auth.model.SystemRole;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — records Verified Citizen badge eligibility for citizen accounts.
 * Badge state remains driven by {@code emailVerified} on {@code RegisterCitizen}.
 */
@Slf4j
@Component
public class VerifiedCitizenBadgeListener implements AuthEventListener<EmailVerifiedEvent> {

    @Override
    public Class<EmailVerifiedEvent> eventType() {
        return EmailVerifiedEvent.class;
    }

    @Override
    public void onEvent(EmailVerifiedEvent event) {
        if (event.getRole() != SystemRole.CITIZEN) {
            return;
        }
        log.info(
                "Verified Citizen badge assigned: userId={}, role={}, timestamp={}, eventType={}",
                event.getSourceId(),
                event.getRole(),
                event.getOccurredAt(),
                event.eventType()
        );
    }
}
