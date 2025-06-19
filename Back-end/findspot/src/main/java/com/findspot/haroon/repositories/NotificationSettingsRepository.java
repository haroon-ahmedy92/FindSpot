package com.findspot.haroon.repositories;

import com.findspot.haroon.models.NotificationSettings;
import com.findspot.haroon.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, Long> {
    Optional<NotificationSettings> findByUser(UserEntity user);
}
