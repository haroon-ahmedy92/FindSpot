package com.findspot.haroon.mappers;

import com.findspot.haroon.dto.RegisterDto;
import com.findspot.haroon.models.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RegisterMapper {
    UserEntity toEntity(RegisterDto registerDto);
}
