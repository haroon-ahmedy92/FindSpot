package com.findspot.haroon.controllers;

import com.findspot.haroon.dto.ChangePasswordRequestDto;
import com.findspot.haroon.dto.UpdateProfileRequestDto;
import com.findspot.haroon.dto.UserProfileDto;
import com.findspot.haroon.dto.UserSettingsDto;
import com.findspot.haroon.models.Item;
import com.findspot.haroon.models.UserEntity;
import com.findspot.haroon.repositories.ItemRepository;
import com.findspot.haroon.repositories.SavedItemRepository;
import com.findspot.haroon.repositories.UserRepository;
import com.findspot.haroon.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private SavedItemRepository savedItemRepository;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getUserProfile(Authentication authentication) {
        return userService.getUserProfile(authentication.getName());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateUserProfile(@RequestBody UpdateProfileRequestDto request,
                                                            Authentication authentication) {
        return userService.updateUserProfile(authentication.getName(), request);
    }

    @PostMapping("/items/{id}/save")
    public ResponseEntity<String> saveItem(@PathVariable Long id,
                                          Authentication authentication) {
        return userService.saveItem(authentication.getName(), id);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Integer>> getUserStats(Authentication authentication) {
        try {
            String username = authentication.getName();
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            int activeLostItems = (int) itemRepository.countByUserAndTypeAndStatus(user, Item.ItemType.LOST, Item.ItemStatus.ACTIVE);
            int activeFoundItems = (int) itemRepository.countByUserAndTypeAndStatus(user, Item.ItemType.FOUND, Item.ItemStatus.ACTIVE);
            int resolvedItems = (int) itemRepository.countByUserAndStatusIn(user, java.util.Arrays.asList(Item.ItemStatus.CLAIMED, Item.ItemStatus.CLOSED));
            int savedItems = (int) savedItemRepository.countByUser(user);
            int totalItems = activeLostItems + activeFoundItems + resolvedItems;

            Map<String, Integer> stats = new HashMap<>();
            stats.put("activeLostItems", activeLostItems);
            stats.put("activeFoundItems", activeFoundItems);
            stats.put("resolvedItems", resolvedItems);
            stats.put("savedItems", savedItems);
            stats.put("totalItems", totalItems);

            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequestDto request,
                                               Authentication authentication) {
        return userService.changePassword(authentication.getName(), request);
    }
    
    @GetMapping("/settings")
    public ResponseEntity<UserSettingsDto> getUserSettings(Authentication authentication) {
        return userService.getUserSettings(authentication.getName());
    }
    
    @PutMapping("/settings/notifications")
    public ResponseEntity<UserSettingsDto.NotificationSettings> updateNotificationSettings(
            @RequestBody UserSettingsDto.NotificationSettings request,
            Authentication authentication) {
        return userService.updateNotificationSettings(authentication.getName(), request);
    }
    
    @PutMapping("/settings/privacy")
    public ResponseEntity<UserSettingsDto.PrivacySettings> updatePrivacySettings(
            @RequestBody UserSettingsDto.PrivacySettings request,
            Authentication authentication) {
        return userService.updatePrivacySettings(authentication.getName(), request);
    }
    
    @PutMapping("/settings/display")
    public ResponseEntity<UserSettingsDto.DisplaySettings> updateDisplaySettings(
            @RequestBody UserSettingsDto.DisplaySettings request,
            Authentication authentication) {
        return userService.updateDisplaySettings(authentication.getName(), request);
    }
    
    @DeleteMapping("/account")
    public ResponseEntity<String> deleteAccount(Authentication authentication) {
        return userService.deleteUserAccount(authentication.getName());
    }
}