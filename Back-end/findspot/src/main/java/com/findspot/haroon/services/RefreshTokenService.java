package com.findspot.haroon.services;

import com.findspot.haroon.models.RefreshToken;
import com.findspot.haroon.models.UserEntity;

import java.util.Optional;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(Long userId);
    Optional<RefreshToken> findByToken(String token);
    RefreshToken verifyExpiration(RefreshToken token);
    void deleteByUser(UserEntity user);
    void deleteExpiredTokens();
}