package com.findspot.haroon.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user_display_settings")
public class DisplaySettings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private String theme = "light";

    @Column(nullable = false)
    private String language = "en";

    @Column(nullable = false)
    private Boolean compactView = false;

    @Column(nullable = false)
    private Boolean showResolvedItems = true;

    @PrePersist
    protected void onCreate() {
        if (theme == null) theme = "light";
        if (language == null) language = "en";
        if (compactView == null) compactView = false;
        if (showResolvedItems == null) showResolvedItems = true;
    }
}
