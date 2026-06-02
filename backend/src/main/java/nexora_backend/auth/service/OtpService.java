package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.config.AuthProperties;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.OtpPurpose;
import nexora_backend.auth.model.UserSource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final String OTP_KEY_PREFIX = "otp:";
    private static final String RESEND_KEY_PREFIX = "otp:resend:";

    private final StringRedisTemplate redisTemplate;
    private final AuthProperties authProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public String generateAndStoreOtp(UserSource source, String sourceId, OtpPurpose purpose, String email) {
        int length = authProperties.getOtp().getLength();
        String otp = generateNumericOtp(length);
        String key = otpKey(source, sourceId, purpose);
        Duration ttl = Duration.ofMinutes(authProperties.getOtp().getExpirationMinutes());
        redisTemplate.opsForValue().set(key, otp + "|" + email, ttl);
        return otp;
    }

    public void verifyOtp(UserSource source, String sourceId, OtpPurpose purpose, String otp) {
        String key = otpKey(source, sourceId, purpose);
        String stored = redisTemplate.opsForValue().get(key);
        if (stored == null) {
            throw AuthErrors.otpExpired();
        }

        String storedOtp = stored.split("\\|")[0];
        if (!storedOtp.equals(otp)) {
            throw AuthErrors.otpInvalid();
        }

        redisTemplate.delete(key);
    }

    /**
     * Resends OTP after enforcing rolling-window resend limits tracked in Redis.
     */
    public OtpResendResult resendOtp(UserSource source, String sourceId, OtpPurpose purpose, String email) {
        assertResendPurposeSupported(purpose);
        enforceResendLimit(source, sourceId);
        int remainingResends = recordResendAttempt(source, sourceId);
        String otp = generateAndStoreOtp(source, sourceId, purpose, email);
        return new OtpResendResult(otp, remainingResends);
    }

    private void assertResendPurposeSupported(OtpPurpose purpose) {
        if (purpose != OtpPurpose.EMAIL_VERIFICATION && purpose != OtpPurpose.PASSWORD_RESET) {
            throw AuthErrors.otpResendUnsupported(purpose.name());
        }
    }

    private void enforceResendLimit(UserSource source, String sourceId) {
        String stored = redisTemplate.opsForValue().get(resendKey(source, sourceId));
        if (stored == null) {
            return;
        }

        ResendWindow window = parseResendWindow(stored);
        if (window.count() < maxResendAttempts()) {
            return;
        }

        long remainingMs = window.windowEndMs() - System.currentTimeMillis();
        if (remainingMs > 0) {
            int retryAfterMinutes = toRetryAfterMinutes(remainingMs);
            throw AuthErrors.otpResendLimit(retryAfterMinutes);
        }
    }

    private int recordResendAttempt(UserSource source, String sourceId) {
        String key = resendKey(source, sourceId);
        String stored = redisTemplate.opsForValue().get(key);
        long now = System.currentTimeMillis();

        int count;
        long firstResendMs;

        if (stored == null) {
            count = 1;
            firstResendMs = now;
        } else {
            ResendWindow window = parseResendWindow(stored);
            if (window.count() >= maxResendAttempts() && now >= window.windowEndMs()) {
                count = 1;
                firstResendMs = now;
            } else {
                count = window.count() + 1;
                firstResendMs = window.firstResendMs();
            }
        }

        long ttlMs = (firstResendMs + resendWindowMs()) - now;
        if (ttlMs <= 0) {
            count = 1;
            firstResendMs = now;
            ttlMs = resendWindowMs();
        }

        redisTemplate.opsForValue().set(
                key,
                count + "|" + firstResendMs,
                Duration.ofMillis(ttlMs)
        );

        return Math.max(0, maxResendAttempts() - count);
    }

    private ResendWindow parseResendWindow(String stored) {
        String[] parts = stored.split("\\|");
        int count = Integer.parseInt(parts[0]);
        long firstResendMs = Long.parseLong(parts[1]);
        long windowEndMs = firstResendMs + resendWindowMs();
        return new ResendWindow(count, firstResendMs, windowEndMs);
    }

    private int toRetryAfterMinutes(long remainingMs) {
        return Math.max(1, (int) Math.ceil(remainingMs / 60000.0));
    }

    private int maxResendAttempts() {
        return authProperties.getOtp().getResendMaxAttempts();
    }

    private long resendWindowMs() {
        return Duration.ofMinutes(authProperties.getOtp().getResendWindowMinutes()).toMillis();
    }

    private String resendKey(UserSource source, String sourceId) {
        return RESEND_KEY_PREFIX + source.name() + ":" + sourceId;
    }

    private String otpKey(UserSource source, String sourceId, OtpPurpose purpose) {
        return OTP_KEY_PREFIX + purpose.name().toLowerCase() + ":" + source.name() + ":" + sourceId;
    }

    private String generateNumericOtp(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(secureRandom.nextInt(10));
        }
        return builder.toString();
    }

    private record ResendWindow(int count, long firstResendMs, long windowEndMs) {
    }
}
