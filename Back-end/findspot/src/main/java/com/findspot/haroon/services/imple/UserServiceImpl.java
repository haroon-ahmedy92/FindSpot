package com.findspot.haroon.services.imple;

import com.findspot.haroon.dto.ChangePasswordRequestDto;
import com.findspot.haroon.dto.UpdateProfileRequestDto;
import com.findspot.haroon.dto.UserProfileDto;
import com.findspot.haroon.dto.UserSettingsDto;
import com.findspot.haroon.models.*;
import com.findspot.haroon.repositories.*;
import com.findspot.haroon.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private SavedItemRepository savedItemRepository;
    
    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;
    
    @Autowired
    private PrivacySettingsRepository privacySettingsRepository;
    
    @Autowired
    private DisplaySettingsRepository displaySettingsRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Override
    public ResponseEntity<UserProfileDto> getUserProfile(String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserProfileDto profile = convertToProfileDto(user);
            return new ResponseEntity<>(profile, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public ResponseEntity<UserProfileDto> updateUserProfile(String username, UpdateProfileRequestDto request) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update fields if provided
            if (StringUtils.hasText(request.getName())) {
                user.setFullName(request.getName());
            }
            if (StringUtils.hasText(request.getEmail())) {
                // Check if email is already taken by another user
                Optional<UserEntity> existingUser = userRepository.findByEmail(request.getEmail());
                if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                    return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }
                user.setEmail(request.getEmail());
            }
            if (StringUtils.hasText(request.getPhone())) {
                user.setPhone(request.getPhone());
            }
            if (StringUtils.hasText(request.getLocation())) {
                user.setLocation(request.getLocation());
            }
            if (StringUtils.hasText(request.getBio())) {
                user.setBio(request.getBio());
            }
            if (StringUtils.hasText(request.getAvatarUrl())) {
                user.setAvatarUrl(request.getAvatarUrl());
            }
            if (request.getPreferences() != null) {
                if (request.getPreferences().getEmailNotifications() != null) {
                    user.setEmailNotifications(request.getPreferences().getEmailNotifications());
                }
                if (request.getPreferences().getPushNotifications() != null) {
                    user.setPushNotifications(request.getPreferences().getPushNotifications());
                }
            }

            UserEntity savedUser = userRepository.save(user);
            UserProfileDto profile = convertToProfileDto(savedUser);
            return new ResponseEntity<>(profile, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> saveItem(String username, Long itemId) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Item> itemOpt = itemRepository.findById(itemId);
            if (itemOpt.isEmpty()) {
                return new ResponseEntity<>("Item not found", HttpStatus.NOT_FOUND);
            }

            Item item = itemOpt.get();

            // Check if item is already saved
            if (savedItemRepository.existsByUserAndItem(user, item)) {
                return new ResponseEntity<>("Item already saved", HttpStatus.OK);
            }

            SavedItem savedItem = new SavedItem();
            savedItem.setUser(user);
            savedItem.setItem(item);
            savedItemRepository.save(savedItem);

            return new ResponseEntity<>("Item saved successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error saving item", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> forgotPassword(String email) {
        try {
            Optional<UserEntity> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return new ResponseEntity<>("Email not found", HttpStatus.NOT_FOUND);
            }

            // TODO: Implement actual email sending logic here
            // For now, just return success message
            // In a real implementation, you would:
            // 1. Generate a password reset token
            // 2. Store it in database with expiration
            // 3. Send email with reset link

            return new ResponseEntity<>("Password reset email sent", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Invalid email", HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<String> changePassword(String username, ChangePasswordRequestDto request) {
        try {
            // Validate request
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return new ResponseEntity<>("New password and confirm password do not match", HttpStatus.BAD_REQUEST);
            }

            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                return new ResponseEntity<>("Current password is incorrect", HttpStatus.BAD_REQUEST);
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating password: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<UserSettingsDto> getUserSettings(String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserSettingsDto settings = new UserSettingsDto();
            
            // Get notification settings
            NotificationSettings notificationSettings = notificationSettingsRepository
                    .findByUser(user)
                    .orElseGet(() -> {
                        NotificationSettings ns = new NotificationSettings();
                        ns.setUser(user);
                        return notificationSettingsRepository.save(ns);
                    });
            
            // Get privacy settings
            PrivacySettings privacySettings = privacySettingsRepository
                    .findByUser(user)
                    .orElseGet(() -> {
                        PrivacySettings ps = new PrivacySettings();
                        ps.setUser(user);
                        return privacySettingsRepository.save(ps);
                    });
            
            // Get display settings
            DisplaySettings displaySettings = displaySettingsRepository
                    .findByUser(user)
                    .orElseGet(() -> {
                        DisplaySettings ds = new DisplaySettings();
                        ds.setUser(user);
                        return displaySettingsRepository.save(ds);
                    });

            // Map entity to DTO
            UserSettingsDto.NotificationSettings notificationSettingsDto = new UserSettingsDto.NotificationSettings();
            notificationSettingsDto.setEmailEnabled(notificationSettings.getEmailEnabled());
            notificationSettingsDto.setPushEnabled(notificationSettings.getPushEnabled());
            notificationSettingsDto.setLostItemAlerts(notificationSettings.getLostItemAlerts());
            notificationSettingsDto.setFoundItemAlerts(notificationSettings.getFoundItemAlerts());
            notificationSettingsDto.setMessageAlerts(notificationSettings.getMessageAlerts());
            
            UserSettingsDto.PrivacySettings privacySettingsDto = new UserSettingsDto.PrivacySettings();
            privacySettingsDto.setShowEmail(privacySettings.getShowEmail());
            privacySettingsDto.setShowPhone(privacySettings.getShowPhone());
            privacySettingsDto.setShowLocation(privacySettings.getShowLocation());
            privacySettingsDto.setAllowMessageFromNonConnections(privacySettings.getAllowMessageFromNonConnections());
            
            UserSettingsDto.DisplaySettings displaySettingsDto = new UserSettingsDto.DisplaySettings();
            displaySettingsDto.setTheme(displaySettings.getTheme());
            displaySettingsDto.setLanguage(displaySettings.getLanguage());
            displaySettingsDto.setCompactView(displaySettings.getCompactView());
            displaySettingsDto.setShowResolvedItems(displaySettings.getShowResolvedItems());
            
            settings.setNotifications(notificationSettingsDto);
            settings.setPrivacy(privacySettingsDto);
            settings.setDisplay(displaySettingsDto);
            
            return new ResponseEntity<>(settings, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<UserSettingsDto.NotificationSettings> updateNotificationSettings(
            String username, UserSettingsDto.NotificationSettings request) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            NotificationSettings settings = notificationSettingsRepository
                    .findByUser(user)
                    .orElseGet(() -> {
                        NotificationSettings ns = new NotificationSettings();
                        ns.setUser(user);
                        return ns;
                    });
            
            // Update fields if provided
            if (request.getEmailEnabled() != null) {
                settings.setEmailEnabled(request.getEmailEnabled());
            }
            if (request.getPushEnabled() != null) {
                settings.setPushEnabled(request.getPushEnabled());
            }
            if (request.getLostItemAlerts() != null) {
                settings.setLostItemAlerts(request.getLostItemAlerts());
            }
            if (request.getFoundItemAlerts() != null) {
                settings.setFoundItemAlerts(request.getFoundItemAlerts());
            }
            if (request.getMessageAlerts() != null) {
                settings.setMessageAlerts(request.getMessageAlerts());
            }
            
            NotificationSettings savedSettings = notificationSettingsRepository.save(settings);
            
            UserSettingsDto.NotificationSettings response = new UserSettingsDto.NotificationSettings();
            response.setEmailEnabled(savedSettings.getEmailEnabled());
            response.setPushEnabled(savedSettings.getPushEnabled());
            response.setLostItemAlerts(savedSettings.getLostItemAlerts());
            response.setFoundItemAlerts(savedSettings.getFoundItemAlerts());
            response.setMessageAlerts(savedSettings.getMessageAlerts());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<UserSettingsDto.PrivacySettings> updatePrivacySettings(
            String username, UserSettingsDto.PrivacySettings request) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            PrivacySettings settings = privacySettingsRepository
                    .findByUser(user)
                    .orElseGet(() -> {
                        PrivacySettings ps = new PrivacySettings();
                        ps.setUser(user);
                        return ps;
                    });
            
            // Update fields if provided
            if (request.getShowEmail() != null) {
                settings.setShowEmail(request.getShowEmail());
            }
            if (request.getShowPhone() != null) {
                settings.setShowPhone(request.getShowPhone());
            }
            if (request.getShowLocation() != null) {
                settings.setShowLocation(request.getShowLocation());
            }
            if (request.getAllowMessageFromNonConnections() != null) {
                settings.setAllowMessageFromNonConnections(request.getAllowMessageFromNonConnections());
            }
            
            PrivacySettings savedSettings = privacySettingsRepository.save(settings);
            
            UserSettingsDto.PrivacySettings response = new UserSettingsDto.PrivacySettings();
            response.setShowEmail(savedSettings.getShowEmail());
            response.setShowPhone(savedSettings.getShowPhone());
            response.setShowLocation(savedSettings.getShowLocation());
            response.setAllowMessageFromNonConnections(savedSettings.getAllowMessageFromNonConnections());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<UserSettingsDto.DisplaySettings> updateDisplaySettings(
            String username, UserSettingsDto.DisplaySettings request) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            DisplaySettings settings = displaySettingsRepository
                    .findByUser(user)
                    .orElseGet(() -> {
                        DisplaySettings ds = new DisplaySettings();
                        ds.setUser(user);
                        return ds;
                    });
            
            // Update fields if provided
            if (StringUtils.hasText(request.getTheme())) {
                settings.setTheme(request.getTheme());
            }
            if (StringUtils.hasText(request.getLanguage())) {
                settings.setLanguage(request.getLanguage());
            }
            if (request.getCompactView() != null) {
                settings.setCompactView(request.getCompactView());
            }
            if (request.getShowResolvedItems() != null) {
                settings.setShowResolvedItems(request.getShowResolvedItems());
            }
            
            DisplaySettings savedSettings = displaySettingsRepository.save(settings);
            
            UserSettingsDto.DisplaySettings response = new UserSettingsDto.DisplaySettings();
            response.setTheme(savedSettings.getTheme());
            response.setLanguage(savedSettings.getLanguage());
            response.setCompactView(savedSettings.getCompactView());
            response.setShowResolvedItems(savedSettings.getShowResolvedItems());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteUserAccount(String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Delete user's refresh tokens
            refreshTokenRepository.deleteByUser(user);
            
            // Delete user's notification settings
            notificationSettingsRepository.findByUser(user)
                .ifPresent(notificationSettingsRepository::delete);
            
            // Delete user's privacy settings
            privacySettingsRepository.findByUser(user)
                .ifPresent(privacySettingsRepository::delete);
            
            // Delete user's display settings
            displaySettingsRepository.findByUser(user)
                .ifPresent(displaySettingsRepository::delete);
            
            // Delete user's saved items
            savedItemRepository.deleteAll(savedItemRepository.findByUser(user, null).getContent());
            
            // Note: In a real-world application, you might want to handle user's items differently
            // (e.g., anonymize them instead of deleting, or have a data retention policy)
            
            // Delete the user
            userRepository.delete(user);
            
            return new ResponseEntity<>("Account successfully deleted", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting account: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private UserProfileDto convertToProfileDto(UserEntity user) {
        UserProfileDto profile = new UserProfileDto();
        profile.setName(user.getFullName());
        profile.setEmail(user.getEmail());
        profile.setPhone(user.getPhone());
        profile.setJoinDate(user.getJoinDate());
        profile.setLocation(user.getLocation());
        profile.setBio(user.getBio());
        profile.setAvatarUrl(user.getAvatarUrl());

        // Calculate stats
        UserProfileDto.UserStats stats = calculateUserStats(user);
        profile.setStats(stats);

        // Set preferences
        UserProfileDto.UserPreferences preferences = new UserProfileDto.UserPreferences();
        preferences.setEmailNotifications(user.getEmailNotifications());
        preferences.setPushNotifications(user.getPushNotifications());
        profile.setPreferences(preferences);

        return profile;
    }

    private UserProfileDto.UserStats calculateUserStats(UserEntity user) {
        UserProfileDto.UserStats stats = new UserProfileDto.UserStats();
        
        // Count reported lost items
        long reportedLost = itemRepository.countByUserAndType(user, Item.ItemType.LOST);
        stats.setReportedLost((int) reportedLost);

        // Count reported found items
        long reportedFound = itemRepository.countByUserAndType(user, Item.ItemType.FOUND);
        stats.setReportedFound((int) reportedFound);

        // Count resolved items (items with status CLAIMED or CLOSED)
        long itemsResolved = itemRepository.countByUserAndStatusIn(user, 
                java.util.Arrays.asList(Item.ItemStatus.CLAIMED, Item.ItemStatus.CLOSED));
        stats.setItemsResolved((int) itemsResolved);

        return stats;
    }
}
