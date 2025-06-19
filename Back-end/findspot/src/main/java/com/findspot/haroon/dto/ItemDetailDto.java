package com.findspot.haroon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemDetailDto {
    private Long id;
    private String title;
    private String shortDescription;
    private String fullDescription;
    private String location;
    private LocalDate date;
    private String status;
    private String category;
    private String type;  // Adding type field to match the expected response
    private String reportedBy; // or foundBy
    private LocalDateTime reportedDate;
    private LocalDateTime resolvedDate;  // Added field for when the item was resolved
    private String contactInfo;
    private List<String> images;
    private Map<String, String> additionalDetails;
}

