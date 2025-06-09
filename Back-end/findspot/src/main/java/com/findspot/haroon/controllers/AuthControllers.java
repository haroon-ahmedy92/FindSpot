package com.findspot.haroon.controllers;

import com.findspot.haroon.dto.AuthResponseDto;
import com.findspot.haroon.dto.LoginDto;
import com.findspot.haroon.dto.RegisterDto;
import com.findspot.haroon.dto.TokenRefreshRequest;
import com.findspot.haroon.exceptions.TokenRefreshException;
import com.findspot.haroon.models.RefreshToken;
import com.findspot.haroon.models.UserEntity;
import com.findspot.haroon.security.JWTGenerator;
import com.findspot.haroon.security.SecurityConstant;
import com.findspot.haroon.services.AuthService;
import com.findspot.haroon.services.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/")
public class AuthControllers {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JWTGenerator jwtGenerator;

    public AuthControllers(AuthService authService, RefreshTokenService refreshTokenService, JWTGenerator jwtGenerator) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.jwtGenerator = jwtGenerator;
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto, HttpServletResponse response){
        System.out.println("Received loginDto: " + loginDto);
        UserEntity user = new UserEntity();
        user.setUsername(loginDto.getUsername());
        user.setPassword(loginDto.getPassword());

        ResponseEntity<AuthResponseDto> authResponse = authService.login(user);

        if (authResponse.getStatusCode().is2xxSuccessful()) {
            // Get user ID for refresh token creation
            UserEntity authenticatedUser = authService.findByUsername(loginDto.getUsername());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authenticatedUser.getId());

            // Set refresh token as HTTP-only cookie
            Cookie refreshCookie = new Cookie(SecurityConstant.REFRESH_COOKIE_NAME, refreshToken.getToken());
            refreshCookie.setHttpOnly(true);
            refreshCookie.setSecure(true); // Set to true in production with HTTPS
            refreshCookie.setPath("/api/auth/");
            refreshCookie.setMaxAge((int) (SecurityConstant.REFRESH_TOKEN_EXPIRATION / 1000));
            response.addCookie(refreshCookie);
        }

        return authResponse;
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        UserEntity user = new UserEntity();
        user.setFullName(registerDto.getFullName());
        user.setEmail(registerDto.getEmail());
        user.setPhone(registerDto.getPhone());
        user.setUsername(registerDto.getUsername());
        user.setPassword(registerDto.getPassword());

        return authService.register(user);
    }

    @PostMapping("refresh-token")
    public ResponseEntity<AuthResponseDto> refreshToken(HttpServletRequest request) {
        String refreshToken = getRefreshTokenFromCookies(request);

        if (refreshToken == null) {
            throw new TokenRefreshException("Refresh token is missing from cookies");
        }

        return refreshTokenService.findByToken(refreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtGenerator.generateTokenFromUsername(user.getUsername());
                    return ResponseEntity.ok(new AuthResponseDto(newAccessToken, "Token refreshed successfully"));
                })
                .orElseThrow(() -> new TokenRefreshException("Refresh token is not in database"));
    }

    @PostMapping("logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = getRefreshTokenFromCookies(request);

        if (refreshToken != null) {
            refreshTokenService.findByToken(refreshToken)
                    .ifPresent(token -> {
                        refreshTokenService.deleteByUser(token.getUser());
                    });
        }

        // Clear refresh token cookie
        Cookie refreshCookie = new Cookie(SecurityConstant.REFRESH_COOKIE_NAME, null);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true);
        refreshCookie.setPath("/api/auth/");
        refreshCookie.setMaxAge(0);
        response.addCookie(refreshCookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    private String getRefreshTokenFromCookies(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (SecurityConstant.REFRESH_COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}