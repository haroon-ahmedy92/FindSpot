package com.findspot.haroon.repositories;

import com.findspot.haroon.models.DisplaySettings;
import com.findspot.haroon.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisplaySettingsRepository extends JpaRepository<DisplaySettings, Long> {
    Optional<DisplaySettings> findByUser(UserEntity user);
}
