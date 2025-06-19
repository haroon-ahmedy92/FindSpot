package com.findspot.haroon.services;

import com.findspot.haroon.dto.*;
import com.findspot.haroon.models.Item;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ItemService {
    ResponseEntity<ItemResponseDto> reportLostItem(LostItemRequestDto request, String username);
    ResponseEntity<ItemResponseDto> reportFoundItem(FoundItemRequestDto request, String username);
    ResponseEntity<PagedResponseDto<ItemDetailDto>> getLostItems(String category, String location, int page, int limit);
    ResponseEntity<PagedResponseDto<ItemDetailDto>> getFoundItems(String category, String location, int page, int limit);
    ResponseEntity<ItemDetailDto> getItemById(Long id);
    ResponseEntity<ItemResponseDto> updateItem(Long id, Map<String, Object> updates, String username);
    ResponseEntity<String> deleteItem(Long id, String username);
    ResponseEntity<ItemResponseDto> updateItemStatus(Long id, String status, String username);
    ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyItems(String username, String status, String type, String sortBy, String sortDir, int page, int limit);
    ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyLostItems(String username, String status, String sortBy, String sortDir, int page, int limit);
    ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyFoundItems(String username, String status, String sortBy, String sortDir, int page, int limit);
    ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyResolvedItems(String username, String sortBy, String sortDir, int page, int limit);
    ResponseEntity<ItemReopenResponseDto> reopenItem(Long id, String username);
}
