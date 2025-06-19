package com.findspot.haroon.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class LostItemRequestDto {
    private String title;
    private String description;
    private String category;
    private String location;
    private String date; // ISO date string
    private List<String> images;
    private Map<String, String> additionalDetails;
}
