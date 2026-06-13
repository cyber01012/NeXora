package nexora_backend.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import nexora_backend.auth.model.AuthenticatedUser;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.auth.model.UserSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtProvider {

    private final SecretKey secretKey;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long accessTokenExpirationMs,
            @Value("${jwt.refresh-expiration}") long refreshTokenExpirationMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(toBase64(secret)));
        this.accessTokenExpirationMs = accessTokenExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    public String generateAccessToken(AuthenticatedUser user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenExpirationMs);
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(user.getIdentifier())
                .claim("role", user.getRole().name())
                .claim("source", user.getSource().name())
                .claim("sourceId", user.getSourceId())
                .claim("email", user.getEmail())
                .claim("displayName", user.getDisplayName())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(AuthenticatedUser user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + refreshTokenExpirationMs);
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(user.getIdentifier())
                .claim("role", user.getRole().name())
                .claim("source", user.getSource().name())
                .claim("sourceId", user.getSourceId())
                .claim("tokenType", "refresh")
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public AuthenticatedUser toAuthenticatedUser(Claims claims, String passwordHash) {
        return AuthenticatedUser.builder()
                .identifier(claims.getSubject())
                .passwordHash(passwordHash)
                .role(SystemRole.valueOf(claims.get("role", String.class)))
                .source(UserSource.valueOf(claims.get("source", String.class)))
                .sourceId(claims.get("sourceId", String.class))
                .email(claims.get("email", String.class))
                .displayName(claims.get("displayName", String.class))
                .active(true)
                .build();
    }

    private String toBase64(String secret) {
        if (secret.matches("^[0-9A-Fa-f]+$") && secret.length() % 2 == 0) {
            byte[] bytes = new byte[secret.length() / 2];
            for (int i = 0; i < bytes.length; i++) {
                bytes[i] = (byte) Integer.parseInt(secret.substring(i * 2, i * 2 + 2), 16);
            }
            return java.util.Base64.getEncoder().encodeToString(bytes);
        }
        if (secret.matches("^[A-Za-z0-9+/=]+$") && secret.length() % 4 == 0) {
            return secret;
        }
        return java.util.Base64.getEncoder().encodeToString(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
}
