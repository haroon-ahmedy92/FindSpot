package com.findspot.haroon.services;

import com.findspot.haroon.dto.AuthResponseDto;
import com.findspot.haroon.models.UserEntity;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<AuthResponseDto> login(UserEntity userEntity);
    ResponseEntity<String> register(UserEntity userEntity);
}
