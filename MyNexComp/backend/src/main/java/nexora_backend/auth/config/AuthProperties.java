package nexora_backend.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "nexora")
public class AuthProperties {

    private final Otp otp = new Otp();
    private final Encryption encryption = new Encryption();
    private final Mail mail = new Mail();
    private final EmailVerification emailVerification = new EmailVerification();
    private String frontendUrl = "http://localhost:5173";

    @Getter
    @Setter
    public static class Otp {
        private int expirationMinutes = 10;
        private int length = 6;
        private int resendMaxAttempts = 2;
        private int resendWindowMinutes = 60;
    }

    @Getter
    @Setter
    public static class Encryption {
        private String key;
    }

    @Getter
    @Setter
    public static class Mail {
        private String from;
    }

    @Getter
    @Setter
    public static class EmailVerification {
        private int expirationHours = 24;
    }
}
