package com.findspot.haroon.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "saved_items")
public class SavedItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false)
    private LocalDateTime savedDate;

    @PrePersist
    protected void onCreate() {
        savedDate = LocalDateTime.now();
    }

    // Unique constraint to prevent duplicate saves
    @Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "item_id"})
    })
    public static class SavedItemConstraints {}
}