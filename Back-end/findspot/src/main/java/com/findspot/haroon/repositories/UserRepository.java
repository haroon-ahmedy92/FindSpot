package com.findspot.haroon.repositories;

import com.findspot.haroon.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String Username);
    Optional<UserEntity> findByEmail(String email);
    Boolean existsByUsername(String username);
}
