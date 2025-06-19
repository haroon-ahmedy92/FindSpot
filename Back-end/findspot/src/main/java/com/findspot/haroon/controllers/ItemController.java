package com.findspot.haroon.controllers;

import com.findspot.haroon.dto.*;
import com.findspot.haroon.services.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/lost")
    public ResponseEntity<ItemResponseDto> reportLostItem(@RequestBody LostItemRequestDto request, 
                                                          Authentication authentication) {
        return itemService.reportLostItem(request, authentication.getName());
    }

    @PostMapping("/found")
    public ResponseEntity<ItemResponseDto> reportFoundItem(@RequestBody FoundItemRequestDto request, 
                                                           Authentication authentication) {
        return itemService.reportFoundItem(request, authentication.getName());
    }

    @GetMapping("/lost")
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getLostItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return itemService.getLostItems(category, location, page, limit);
    }

    @GetMapping("/found")
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getFoundItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return itemService.getFoundItems(category, location, page, limit);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDetailDto> getItemById(@PathVariable Long id) {
        return itemService.getItemById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponseDto> updateItem(@PathVariable Long id,
                                                      @RequestBody Map<String, Object> updates,
                                                      Authentication authentication) {
        return itemService.updateItem(id, updates, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id, 
                                             Authentication authentication) {
        return itemService.deleteItem(id, authentication.getName());
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<ItemResponseDto> updateItemStatus(@PathVariable Long id,
                                                            @RequestBody Map<String, String> statusRequest,
                                                            Authentication authentication) {
        return itemService.updateItemStatus(id, statusRequest.get("status"), authentication.getName());
    }


    @GetMapping("/my-items")
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyItems(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        return itemService.getMyItems(authentication.getName(), status, type, sortBy, sortDir, page, limit);
    }

    @GetMapping("/my-lost")
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyLostItems(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        return itemService.getMyLostItems(authentication.getName(), status, sortBy, sortDir, page, limit);
    }

    @GetMapping("/my-found")
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyFoundItems(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        return itemService.getMyFoundItems(authentication.getName(), status, sortBy, sortDir, page, limit);
    }

    @GetMapping("/my-resolved")
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyResolvedItems(
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        return itemService.getMyResolvedItems(authentication.getName(), sortBy, sortDir, page, limit);
    }

    @PostMapping("/{itemId}/reopen")
    public ResponseEntity<ItemReopenResponseDto> reopenItem(
            @PathVariable Long itemId,
            Authentication authentication) {
        return itemService.reopenItem(itemId, authentication.getName());
    }
}
