package com.findspot.haroon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDto {
    private String name;
    private String email;
    private String phone;
    private LocalDateTime joinDate;
    private String location;
    private String bio;
    private String avatarUrl;
    private UserStats stats;
    private UserPreferences preferences;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserStats {
        private int reportedLost;
        private int reportedFound;
        private int itemsResolved;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserPreferences {
        private boolean emailNotifications;
        private boolean pushNotifications;
    }
}