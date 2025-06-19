package com.findspot.haroon.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_privacy_settings")
public class PrivacySettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private Boolean showEmail = true;

    @Column(nullable = false)
    private Boolean showPhone = true;

    @Column(nullable = false)
    private Boolean showLocation = true;

    @Column(nullable = false)
    private Boolean allowMessageFromNonConnections = true;

    @PrePersist
    protected void onCreate() {
        if (showEmail == null) showEmail = true;
        if (showPhone == null) showPhone = true;
        if (showLocation == null) showLocation = true;
        if (allowMessageFromNonConnections == null) allowMessageFromNonConnections = true;
    }
}
