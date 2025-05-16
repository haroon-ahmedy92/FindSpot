package com.findspot.haroon.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String accesToken;
    private String type = "Bearer ";

    public AuthResponseDto(String accesToken) {
        this.accesToken = accesToken;
    }
}
