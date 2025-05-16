package com.findspot.haroon.controllers;

import com.findspot.haroon.dto.AuthResponseDto;
import com.findspot.haroon.dto.LoginDto;
import com.findspot.haroon.mappers.LoginMapper;
import com.findspot.haroon.mappers.RegisterMapper;
import com.findspot.haroon.dto.RegisterDto;
import com.findspot.haroon.models.UserEntity;
import com.findspot.haroon.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/")
public class AuthControllers {

    private RegisterMapper registerMapper;
    private AuthService authService;
    private LoginMapper loginMapper;

    public AuthControllers(AuthService authService,
                           RegisterMapper registerMapper,
                           LoginMapper loginMapper) {
        this.registerMapper = registerMapper;
        this.authService = authService;
        this.loginMapper = loginMapper;
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginDto loginDto){
        UserEntity user = loginMapper.toEntity(loginDto);
        return authService.login(user);
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        UserEntity user = registerMapper.toEntity(registerDto);
        return authService.register(user);
    }
}
