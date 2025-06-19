package com.findspot.haroon.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PagedResponseDto<T> {
    private List<T> content;
    private long totalElements;
    private int totalPages;
    private int page;
    private int limit;

    public static <T> PagedResponseDto<T> fromPage(Page<T> page) {
        PagedResponseDto<T> response = new PagedResponseDto<>();
        response.setContent(page.getContent());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setPage(page.getNumber());
        response.setLimit(page.getSize());
        return response;
    }
}
