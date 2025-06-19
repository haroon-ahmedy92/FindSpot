package com.findspot.haroon.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class FoundItemRequestDto {
    private String title;
    private String category;
    private String description;
    private String location;
    private String date; // ISO date string
    private List<String> images;
    private String status; // with-me or turned-in
    private String contactPreference; // email, phone, both
    private Boolean agreedToTerms;
}