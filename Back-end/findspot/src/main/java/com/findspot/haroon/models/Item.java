package com.findspot.haroon.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 500)
    private String shortDescription;

    @Column(length = 2000)
    private String fullDescription;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType type; // LOST or FOUND

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status; // ACTIVE, CLAIMED, CLOSED

    @ElementCollection
    @CollectionTable(name = "item_images", joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "item_additional_details", joinColumns = @JoinColumn(name = "item_id"))
    @MapKeyColumn(name = "detail_key")
    @Column(name = "detail_value")
    private Map<String, String> additionalDetails;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private LocalDateTime reportedDate;

    @Column
    private LocalDateTime resolvedDate;  // Added field to track when an item was resolved

    @Column
    private String contactPreference; // For found items: email, phone, both

    @Column
    private Boolean agreedToTerms; // For found items

    @PrePersist
    protected void onCreate() {
        reportedDate = LocalDateTime.now();
        if (status == null) {
            status = ItemStatus.ACTIVE;
        }
    }

    public enum ItemType {
        LOST, FOUND
    }

    public enum ItemStatus {
        ACTIVE, CLAIMED, CLOSED
    }
}

