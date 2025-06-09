package com.findspot.haroon.services.imple;

import com.findspot.haroon.exceptions.TokenRefreshException;
import com.findspot.haroon.models.RefreshToken;
import com.findspot.haroon.models.UserEntity;
import com.findspot.haroon.repositories.RefreshTokenRepository;
import com.findspot.haroon.repositories.UserRepository;
import com.findspot.haroon.security.SecurityConstant;
import com.findspot.haroon.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public RefreshToken createRefreshToken(Long userId) {
        // Delete existing refresh token for user
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(SecurityConstant.REFRESH_TOKEN_EXPIRATION));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Override
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    @Override
    public void deleteByUser(UserEntity user) {
        refreshTokenRepository.deleteByUser(user);
    }

    @Override
    public void deleteExpiredTokens() {
        refreshTokenRepository.deleteExpiredTokens();
    }
}