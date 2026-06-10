package nexora_backend.auth.pattern.observer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nexora_backend.auth.model.CitizenBadge;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.service.CitizenBadgeService;
import nexora_backend.database.repository.RegisterCitizenRepository;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — records citizen badge tier after email verification.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class VerifiedCitizenBadgeListener implements AuthEventListener<EmailVerifiedEvent> {

    private final RegisterCitizenRepository registerCitizenRepository;
    private final CitizenBadgeService citizenBadgeService;

    @Override
    public Class<EmailVerifiedEvent> eventType() {
        return EmailVerifiedEvent.class;
    }

    @Override
    public void onEvent(EmailVerifiedEvent event) {
        if (event.getRole() != SystemRole.CITIZEN) {
            return;
        }

        registerCitizenRepository.findById(Long.parseLong(event.getSourceId())).ifPresent(citizen -> {
            CitizenBadge badge = citizenBadgeService.resolve(true, citizen.getCnicValidated());
            log.info(
                    "Citizen badge updated: userId={}, badge={}, timestamp={}, eventType={}",
                    event.getSourceId(),
                    badge,
                    event.getOccurredAt(),
                    event.eventType()
            );
        });
    }
}
