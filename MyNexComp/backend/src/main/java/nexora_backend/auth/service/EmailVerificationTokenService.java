package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.config.AuthProperties;
import nexora_backend.auth.exception.AuthErrors;
import nexora_backend.auth.model.UserSource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationTokenService {

    private static final String TOKEN_KEY_PREFIX = "email-verify:";
    private static final String RESEND_KEY_PREFIX = "email-verify:resend:";

    private final StringRedisTemplate redisTemplate;
    private final AuthProperties authProperties;

    public String generateAndStoreToken(UserSource source, String sourceId, String email) {
        String token = UUID.randomUUID().toString();
        String payload = source.name() + "|" + sourceId + "|" + email;
        Duration ttl = Duration.ofHours(authProperties.getEmailVerification().getExpirationHours());
        redisTemplate.opsForValue().set(tokenKey(token), payload, ttl);
        return token;
    }

    public EmailVerificationTokenData verifyToken(String token) {
        if (token == null || token.isBlank()) {
            throw AuthErrors.emailVerificationTokenInvalid();
        }
        String stored = redisTemplate.opsForValue().get(tokenKey(token));
        if (stored == null) {
            throw AuthErrors.emailVerificationTokenExpired();
        }

        String[] parts = stored.split("\\|", 3);
        if (parts.length != 3) {
            throw AuthErrors.emailVerificationTokenInvalid();
        }

        redisTemplate.delete(tokenKey(token));
        return new EmailVerificationTokenData(
                UserSource.valueOf(parts[0]),
                parts[1],
                parts[2]
        );
    }

    public EmailVerificationResendResult resendVerificationLink(UserSource source, String sourceId, String email) {
        enforceResendLimit(source, sourceId);
        int remainingResends = recordResendAttempt(source, sourceId);
        String token = generateAndStoreToken(source, sourceId, email);
        return new EmailVerificationResendResult(token, remainingResends);
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
            int retryAfterMinutes = Math.max(1, (int) Math.ceil(remainingMs / 60000.0));
            throw AuthErrors.emailVerificationResendLimit(retryAfterMinutes);
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

        redisTemplate.opsForValue().set(key, count + "|" + firstResendMs, Duration.ofMillis(ttlMs));
        return Math.max(0, maxResendAttempts() - count);
    }

    private ResendWindow parseResendWindow(String stored) {
        String[] parts = stored.split("\\|");
        int count = Integer.parseInt(parts[0]);
        long firstResendMs = Long.parseLong(parts[1]);
        long windowEndMs = firstResendMs + resendWindowMs();
        return new ResendWindow(count, firstResendMs, windowEndMs);
    }

    private int maxResendAttempts() {
        return authProperties.getOtp().getResendMaxAttempts();
    }

    private long resendWindowMs() {
        return Duration.ofMinutes(authProperties.getOtp().getResendWindowMinutes()).toMillis();
    }

    private String tokenKey(String token) {
        return TOKEN_KEY_PREFIX + token;
    }

    private String resendKey(UserSource source, String sourceId) {
        return RESEND_KEY_PREFIX + source.name() + ":" + sourceId;
    }

    public record EmailVerificationTokenData(UserSource source, String sourceId, String email) {
    }

    public record EmailVerificationResendResult(String token, int remainingResends) {
    }

    private record ResendWindow(int count, long firstResendMs, long windowEndMs) {
    }
}
