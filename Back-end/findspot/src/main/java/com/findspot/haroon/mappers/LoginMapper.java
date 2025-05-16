package com.findspot.haroon.mappers;

import com.findspot.haroon.dto.AuthResponseDto;
import com.findspot.haroon.dto.LoginDto;
import com.findspot.haroon.models.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LoginMapper {
    UserEntity toEntity(LoginDto loginDto);
    AuthResponseDto toDto(UserEntity userEntity);
}
