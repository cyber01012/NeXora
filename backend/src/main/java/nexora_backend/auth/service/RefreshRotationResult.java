package nexora_backend.auth.service;

import nexora_backend.auth.model.AuthenticatedUser;

public record RefreshRotationResult(AuthenticatedUser user, String refreshToken) {
}
