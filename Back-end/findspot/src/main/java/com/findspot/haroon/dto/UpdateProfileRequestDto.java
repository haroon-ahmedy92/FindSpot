package com.findspot.haroon.dto;

import lombok.Data;

import java.util.Map;

@Data
public class UpdateProfileRequestDto {
    private String name;
    private String email;
    private String phone;
    private String location;
    private String bio;
    private String avatarUrl;
    private UserPreferences preferences;

    @Data
    public static class UserPreferences {
        private Boolean emailNotifications;
        private Boolean pushNotifications;
    }
}