package com.findspot.haroon.repositories;

import com.findspot.haroon.models.PrivacySettings;
import com.findspot.haroon.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrivacySettingsRepository extends JpaRepository<PrivacySettings, Long> {
    Optional<PrivacySettings> findByUser(UserEntity user);
}
