package com.findspot.haroon.services;

import com.findspot.haroon.dto.ChangePasswordRequestDto;
import com.findspot.haroon.dto.UpdateProfileRequestDto;
import com.findspot.haroon.dto.UserProfileDto;
import com.findspot.haroon.dto.UserSettingsDto;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<UserProfileDto> getUserProfile(String username);
    ResponseEntity<UserProfileDto> updateUserProfile(String username, UpdateProfileRequestDto request);
    ResponseEntity<String> saveItem(String username, Long itemId);
    ResponseEntity<String> forgotPassword(String email);
    
    // New methods for user management endpoints
    ResponseEntity<String> changePassword(String username, ChangePasswordRequestDto request);
    ResponseEntity<UserSettingsDto> getUserSettings(String username);
    ResponseEntity<UserSettingsDto.NotificationSettings> updateNotificationSettings(String username, UserSettingsDto.NotificationSettings request);
    ResponseEntity<UserSettingsDto.PrivacySettings> updatePrivacySettings(String username, UserSettingsDto.PrivacySettings request);
    ResponseEntity<UserSettingsDto.DisplaySettings> updateDisplaySettings(String username, UserSettingsDto.DisplaySettings request);
    ResponseEntity<String> deleteUserAccount(String username);
}