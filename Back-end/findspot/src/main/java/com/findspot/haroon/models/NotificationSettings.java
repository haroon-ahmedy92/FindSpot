package com.findspot.haroon.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_notification_settings")
public class NotificationSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private Boolean emailEnabled = true;

    @Column(nullable = false)
    private Boolean pushEnabled = true;

    @Column(nullable = false)
    private Boolean lostItemAlerts = true;

    @Column(nullable = false)
    private Boolean foundItemAlerts = true;

    @Column(nullable = false)
    private Boolean messageAlerts = true;

    @PrePersist
    protected void onCreate() {
        if (emailEnabled == null) emailEnabled = true;
        if (pushEnabled == null) pushEnabled = true;
        if (lostItemAlerts == null) lostItemAlerts = true;
        if (foundItemAlerts == null) foundItemAlerts = true;
        if (messageAlerts == null) messageAlerts = true;
    }
}
