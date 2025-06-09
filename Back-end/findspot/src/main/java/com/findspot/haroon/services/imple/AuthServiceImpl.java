package com.findspot.haroon.services.imple;

import com.findspot.haroon.dto.AuthResponseDto;
import com.findspot.haroon.models.Role;
import com.findspot.haroon.models.UserEntity;
import com.findspot.haroon.repositories.RoleRepository;
import com.findspot.haroon.repositories.UserRepository;
import com.findspot.haroon.security.JWTGenerator;
import com.findspot.haroon.services.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JWTGenerator jwtGenerator;

    public AuthServiceImpl(UserRepository userRepository,
                           AuthenticationManager authenticationManager,
                           PasswordEncoder passwordEncoder,
                           RoleRepository roleRepository,
                           JWTGenerator jwtGenerator) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }

    @Override
    public ResponseEntity<AuthResponseDto> login(UserEntity userEntity) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userEntity.getUsername(), userEntity.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtGenerator.generateToken(authentication);
        System.out.println("Generated JWT: " + token);

        return new ResponseEntity<>(new AuthResponseDto(token), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> register(UserEntity userEntity) {
        if (userRepository.existsByUsername(userEntity.getUsername())) {
            return new ResponseEntity<>("Username is already taken", HttpStatus.BAD_REQUEST);
        }

        UserEntity user = new UserEntity();
        user.setUsername(userEntity.getUsername());
        user.setPhone(userEntity.getPhone());
        user.setFullName(userEntity.getFullName());
        user.setEmail(userEntity.getEmail());
        user.setPassword(passwordEncoder.encode(userEntity.getPassword()));

        Role role = roleRepository.findByName("USER").orElseThrow(() -> new RuntimeException("Role not found"));
        user.setRoles(Collections.singletonList(role));

        userRepository.save(user);
        return new ResponseEntity<>("User has been registered successfully", HttpStatus.OK);
    }

    @Override
    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }
}