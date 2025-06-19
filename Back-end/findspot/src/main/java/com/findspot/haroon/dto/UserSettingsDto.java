package com.findspot.haroon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSettingsDto {
    private NotificationSettings notifications;
    private PrivacySettings privacy;
    private DisplaySettings display;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class NotificationSettings {
        private Boolean emailEnabled;
        private Boolean pushEnabled;
        private Boolean lostItemAlerts;
        private Boolean foundItemAlerts;
        private Boolean messageAlerts;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PrivacySettings {
        private Boolean showEmail;
        private Boolean showPhone;
        private Boolean showLocation;
        private Boolean allowMessageFromNonConnections;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DisplaySettings {
        private String theme;
        private String language;
        private Boolean compactView;
        private Boolean showResolvedItems;
    }
}
