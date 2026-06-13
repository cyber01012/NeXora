package nexora_backend.auth.pattern.observer;

import nexora_backend.auth.pattern.observer.bridge.AccountCreatedNotificationBridgeListener;
import nexora_backend.auth.pattern.observer.bridge.PasswordResetNotificationBridgeListener;
import org.springframework.stereotype.Component;

/**
 * Observer Pattern — explicit wiring of listeners to {@link AuthEventPublisher}.
 * Demonstrates Publisher → Event → Observer registration for academic evaluation.
 */
@Component
public class AuthObserverRegistration {

    public AuthObserverRegistration(
            AuthEventPublisher publisher,
            WelcomeEmailListener welcomeEmailListener,
            VerifiedCitizenBadgeListener verifiedCitizenBadgeListener,
            AuditLogListener auditLogListener,
            RegistrationAuditListener registrationAuditListener,
            SecurityNotificationListener securityNotificationListener,
            PasswordResetNotificationBridgeListener passwordResetNotificationBridgeListener,
            AccountCreatedNotificationBridgeListener accountCreatedNotificationBridgeListener
    ) {
        publisher.subscribe(EmailVerifiedEvent.class, welcomeEmailListener);
        publisher.subscribe(EmailVerifiedEvent.class, verifiedCitizenBadgeListener);
        publisher.subscribe(EmailVerifiedEvent.class, auditLogListener);

        publisher.subscribe(UserRegisteredEvent.class, registrationAuditListener);
        publisher.subscribe(UserRegisteredEvent.class, accountCreatedNotificationBridgeListener);

        publisher.subscribe(PasswordChangedEvent.class, securityNotificationListener);
        publisher.subscribe(PasswordResetTriggeredEvent.class, passwordResetNotificationBridgeListener);
    }
}
