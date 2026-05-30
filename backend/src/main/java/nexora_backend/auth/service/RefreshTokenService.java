package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.exception.AuthException;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.UserSource;
import nexora_backend.auth.security.JwtProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final String REFRESH_TOKEN_PREFIX = "refresh:";
    private static final String USER_TOKENS_PREFIX = "user_tokens:";

    private final StringRedisTemplate redisTemplate;
    private final JwtProvider jwtProvider;
    private final UserLookupService userLookupService;

    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpirationMs;

    public String issueRefreshToken(AuthenticatedUser user, String deviceId) {
        String refreshToken = jwtProvider.generateRefreshToken(user);
        String tokenKey = tokenKey(refreshToken);
        String userTokensKey = userTokensKey(user.getSource(), user.getSourceId());

        Duration ttl = Duration.ofMillis(refreshTokenExpirationMs);
        redisTemplate.opsForValue().set(tokenKey, user.getSource().name() + "|" + user.getSourceId() + "|" + deviceId, ttl);
        redisTemplate.opsForSet().add(userTokensKey, refreshToken);
        redisTemplate.expire(userTokensKey, ttl);

        return refreshToken;
    }

    public RefreshRotationResult validateAndRotate(String refreshToken) {
        String tokenKey = tokenKey(refreshToken);
        String stored = redisTemplate.opsForValue().get(tokenKey);
        if (stored == null) {
            throw new AuthException(HttpStatus.UNAUTHORIZED, "Refresh token invalid or expired");
        }

        String[] parts = stored.split("\\|");
        UserSource source = UserSource.valueOf(parts[0]);
        String sourceId = parts[1];
        String storedDeviceId = parts.length > 2 ? parts[2] : UUID.randomUUID().toString();

        redisTemplate.delete(tokenKey);
        redisTemplate.opsForSet().remove(userTokensKey(source, sourceId), refreshToken);

        AuthenticatedUser user = userLookupService.findBySource(source, sourceId);
        String newRefreshToken = issueRefreshToken(user, storedDeviceId);
        return new RefreshRotationResult(user, newRefreshToken);
    }

    public void revokeToken(String refreshToken) {
        String tokenKey = tokenKey(refreshToken);
        String stored = redisTemplate.opsForValue().get(tokenKey);
        if (stored != null) {
            String[] parts = stored.split("\\|");
            redisTemplate.opsForSet().remove(userTokensKey(UserSource.valueOf(parts[0]), parts[1]), refreshToken);
        }
        redisTemplate.delete(tokenKey);
    }

    public void revokeAllTokens(UserSource source, String sourceId) {
        String userTokensKey = userTokensKey(source, sourceId);
        Set<String> tokens = redisTemplate.opsForSet().members(userTokensKey);
        if (tokens != null) {
            for (String token : tokens) {
                redisTemplate.delete(tokenKey(token));
            }
        }
        redisTemplate.delete(userTokensKey);
    }

    private String tokenKey(String refreshToken) {
        return REFRESH_TOKEN_PREFIX + refreshToken;
    }

    private String userTokensKey(UserSource source, String sourceId) {
        return USER_TOKENS_PREFIX + source.name() + ":" + sourceId;
    }
}
