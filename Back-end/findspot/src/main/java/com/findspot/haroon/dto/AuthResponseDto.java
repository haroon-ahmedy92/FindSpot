
package com.findspot.haroon.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accessToken;
    private String type = "Bearer";
    private String message;

    public AuthResponseDto(String accessToken) {
        this.accessToken = accessToken;
        this.message = "Login successful";
    }

    public AuthResponseDto(String accessToken, String message) {
        this.accessToken = accessToken;
        this.message = message;
    }
}