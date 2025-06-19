package com.findspot.haroon.services.imple;

import com.findspot.haroon.dto.*;
import com.findspot.haroon.models.Item;
import com.findspot.haroon.models.UserEntity;
import com.findspot.haroon.repositories.ItemRepository;
import com.findspot.haroon.repositories.SavedItemRepository;
import com.findspot.haroon.repositories.UserRepository;
import com.findspot.haroon.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Map;
import java.util.Optional;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SavedItemRepository savedItemRepository;

    @Override
    public ResponseEntity<ItemResponseDto> reportLostItem(LostItemRequestDto request, String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getDescription()) ||
                !StringUtils.hasText(request.getCategory()) || !StringUtils.hasText(request.getLocation()) ||
                !StringUtils.hasText(request.getDate())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Item item = new Item();
            item.setTitle(request.getTitle());
            item.setShortDescription(truncateDescription(request.getDescription()));
            item.setFullDescription(request.getDescription());
            item.setCategory(request.getCategory());
            item.setLocation(request.getLocation());
            item.setDate(LocalDate.parse(request.getDate()));
            item.setType(Item.ItemType.LOST);
            item.setStatus(Item.ItemStatus.ACTIVE);
            item.setImages(request.getImages());
            item.setAdditionalDetails(request.getAdditionalDetails());
            item.setUser(user);

            Item savedItem = itemRepository.save(item);

            return new ResponseEntity<>(
                    new ItemResponseDto(savedItem.getId(), savedItem.getTitle(), savedItem.getStatus().name()),
                    HttpStatus.CREATED
            );

        } catch (DateTimeParseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<ItemResponseDto> reportFoundItem(FoundItemRequestDto request, String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!StringUtils.hasText(request.getTitle()) || !StringUtils.hasText(request.getDescription()) ||
                !StringUtils.hasText(request.getCategory()) || !StringUtils.hasText(request.getLocation()) ||
                !StringUtils.hasText(request.getDate()) || !Boolean.TRUE.equals(request.getAgreedToTerms())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            Item item = new Item();
            item.setTitle(request.getTitle());
            item.setShortDescription(truncateDescription(request.getDescription()));
            item.setFullDescription(request.getDescription());
            item.setCategory(request.getCategory());
            item.setLocation(request.getLocation());
            item.setDate(LocalDate.parse(request.getDate()));
            item.setType(Item.ItemType.FOUND);
            item.setStatus(Item.ItemStatus.ACTIVE);
            item.setImages(request.getImages());
            item.setUser(user);
            item.setContactPreference(request.getContactPreference());
            item.setAgreedToTerms(request.getAgreedToTerms());

            Item savedItem = itemRepository.save(item);

            return new ResponseEntity<>(
                    new ItemResponseDto(savedItem.getId(), savedItem.getTitle(), savedItem.getStatus().name()),
                    HttpStatus.CREATED
            );

        } catch (DateTimeParseException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getLostItems(String category, String location, int page, int limit) {
        try {
            Pageable pageable = PageRequest.of(page, limit, Sort.by("reportedDate").descending());

            Page<Item> items;
            if (StringUtils.hasText(category) || StringUtils.hasText(location)) {
                items = itemRepository.findByTypeAndFilters(Item.ItemType.LOST, category, location, pageable);
            } else {
                items = itemRepository.findByType(Item.ItemType.LOST, pageable);
            }

            Page<ItemDetailDto> itemDtos = items.map(this::convertToDetailDto);
            PagedResponseDto<ItemDetailDto> response = PagedResponseDto.fromPage(itemDtos);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getFoundItems(String category, String location, int page, int limit) {
        try {
            Pageable pageable = PageRequest.of(page, limit, Sort.by("reportedDate").descending());

            Page<Item> items;
            if (StringUtils.hasText(category) || StringUtils.hasText(location)) {
                items = itemRepository.findByTypeAndFilters(Item.ItemType.FOUND, category, location, pageable);
            } else {
                items = itemRepository.findByType(Item.ItemType.FOUND, pageable);
            }

            Page<ItemDetailDto> itemDtos = items.map(this::convertToDetailDto);
            PagedResponseDto<ItemDetailDto> response = PagedResponseDto.fromPage(itemDtos);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public ResponseEntity<ItemDetailDto> getItemById(Long id) {
        Optional<Item> itemOpt = itemRepository.findById(id);

        if (itemOpt.isPresent()) {
            ItemDetailDto itemDto = convertToDetailDto(itemOpt.get());
            return new ResponseEntity<>(itemDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<ItemResponseDto> updateItem(Long id, Map<String, Object> updates, String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Item> itemOpt = itemRepository.findById(id);
            if (itemOpt.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Item item = itemOpt.get();
            if (!item.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            // Update fields if provided
            if (updates.containsKey("title")) {
                item.setTitle((String) updates.get("title"));
            }
            if (updates.containsKey("description")) {
                String description = (String) updates.get("description");
                item.setShortDescription(truncateDescription(description));
                item.setFullDescription(description);
            }
            if (updates.containsKey("category")) {
                item.setCategory((String) updates.get("category"));
            }
            if (updates.containsKey("location")) {
                item.setLocation((String) updates.get("location"));
            }
            if (updates.containsKey("date")) {
                item.setDate(LocalDate.parse((String) updates.get("date")));
            }
            if (updates.containsKey("status")) {
                item.setStatus(Item.ItemStatus.valueOf(((String) updates.get("status")).toUpperCase()));
            }
            if (updates.containsKey("contactPreference")) {
                item.setContactPreference((String) updates.get("contactPreference"));
            }

            Item savedItem = itemRepository.save(item);

            return new ResponseEntity<>(
                    new ItemResponseDto(savedItem.getId(), savedItem.getTitle(), savedItem.getStatus().name()),
                    HttpStatus.OK
            );

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    @Transactional
    public ResponseEntity<String> deleteItem(Long id, String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Item> itemOpt = itemRepository.findById(id);
            if (itemOpt.isEmpty()) {
                return new ResponseEntity<>("Item not found", HttpStatus.NOT_FOUND);
            }

            Item item = itemOpt.get();
            if (!item.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
            }

            // First, delete all saved item references to avoid foreign key constraint violation
            savedItemRepository.deleteAll(savedItemRepository.findByItem(item));

            // Then delete the item itself
            itemRepository.delete(item);
            return new ResponseEntity<>("Item deleted successfully", HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting item", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<ItemResponseDto> updateItemStatus(Long id, String status, String username) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<Item> itemOpt = itemRepository.findById(id);
            if (itemOpt.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Item item = itemOpt.get();
            if (!item.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }

            // Validate and set status
            try {
                Item.ItemStatus newStatus;
                switch (status.toLowerCase()) {
                    case "found":
                    case "claimed":
                        newStatus = Item.ItemStatus.CLAIMED;
                        // Set resolvedDate to current time when status changes to CLAIMED
                        item.setResolvedDate(LocalDateTime.now());
                        break;
                    case "returned":
                    case "resolved":
                    case "closed":
                        newStatus = Item.ItemStatus.CLOSED;
                        // Set resolvedDate to current time when status changes to CLOSED
                        item.setResolvedDate(LocalDateTime.now());
                        break;
                    case "active":
                        newStatus = Item.ItemStatus.ACTIVE;
                        // Clear resolvedDate when status changes to ACTIVE
                        item.setResolvedDate(null);
                        break;
                    default:
                        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
                }

                item.setStatus(newStatus);
                Item savedItem = itemRepository.save(item);

                return new ResponseEntity<>(
                        new ItemResponseDto(savedItem.getId(), savedItem.getTitle(), savedItem.getStatus().name()),
                        HttpStatus.OK
                );

            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyItems(String username, String status, String type, String sortBy, String sortDir, int page, int limit) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create sort object
            Sort sort = createSort(sortBy, sortDir);
            Pageable pageable = PageRequest.of(page, limit, sort);

            // Parse filters
            Item.ItemStatus statusFilter = parseStatus(status);
            Item.ItemType typeFilter = parseType(type);

            Page<Item> items = itemRepository.findByUserWithFilters(user, statusFilter, typeFilter, pageable);
            Page<ItemDetailDto> itemDtos = items.map(this::convertToDetailDto);

            PagedResponseDto<ItemDetailDto> response = PagedResponseDto.fromPage(itemDtos);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyLostItems(String username, String status, String sortBy, String sortDir, int page, int limit) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Sort sort = createSort(sortBy, sortDir);
            Pageable pageable = PageRequest.of(page, limit, sort);

            Item.ItemStatus statusFilter = parseStatus(status);

            Page<Item> items;
            if (statusFilter != null) {
                items = itemRepository.findByUserAndTypeWithStatus(user, Item.ItemType.LOST, statusFilter, pageable);
            } else {
                items = itemRepository.findByUserAndType(user, Item.ItemType.LOST, pageable);
            }

            Page<ItemDetailDto> itemDtos = items.map(this::convertToDetailDto);
            PagedResponseDto<ItemDetailDto> response = PagedResponseDto.fromPage(itemDtos);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyFoundItems(String username, String status, String sortBy, String sortDir, int page, int limit) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Sort sort = createSort(sortBy, sortDir);
            Pageable pageable = PageRequest.of(page, limit, sort);

            Item.ItemStatus statusFilter = parseStatus(status);

            Page<Item> items;
            if (statusFilter != null) {
                items = itemRepository.findByUserAndTypeWithStatus(user, Item.ItemType.FOUND, statusFilter, pageable);
            } else {
                items = itemRepository.findByUserAndType(user, Item.ItemType.FOUND, pageable);
            }

            Page<ItemDetailDto> itemDtos = items.map(this::convertToDetailDto);
            PagedResponseDto<ItemDetailDto> response = PagedResponseDto.fromPage(itemDtos);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<PagedResponseDto<ItemDetailDto>> getMyResolvedItems(String username, String sortBy, String sortDir, int page, int limit) {
        try {
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Sort sort = createSort(sortBy, sortDir);
            Pageable pageable = PageRequest.of(page, limit, sort);

            Page<Item> items = itemRepository.findResolvedItemsByUser(user, pageable);
            Page<ItemDetailDto> itemDtos = items.map(this::convertToDetailDto);

            PagedResponseDto<ItemDetailDto> response = PagedResponseDto.fromPage(itemDtos);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<ItemReopenResponseDto> reopenItem(Long id, String username) {
        try {
            // Find the user
            UserEntity user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Find the item
            Optional<Item> itemOpt = itemRepository.findById(id);
            if (itemOpt.isEmpty()) {
                return new ResponseEntity<>(
                        new ItemReopenResponseDto(false, "Item not found", null),
                        HttpStatus.NOT_FOUND);
            }

            Item item = itemOpt.get();

            // Check if the user owns the item
            if (!item.getUser().getId().equals(user.getId())) {
                return new ResponseEntity<>(
                        new ItemReopenResponseDto(false, "You don't have permission to reopen this item", null),
                        HttpStatus.FORBIDDEN);
            }

            // Check if the item is in a resolved state (CLAIMED or CLOSED)
            if (item.getStatus() != Item.ItemStatus.CLAIMED && item.getStatus() != Item.ItemStatus.CLOSED) {
                return new ResponseEntity<>(
                        new ItemReopenResponseDto(false,
                                "Only items with CLAIMED or CLOSED status can be reopened", null),
                        HttpStatus.BAD_REQUEST);
            }

            // Reopen the item
            item.setStatus(Item.ItemStatus.ACTIVE);
            item.setResolvedDate(null); // Clear the resolved date
            Item savedItem = itemRepository.save(item);

            // Convert to DTO and return successful response
            ItemDetailDto itemDto = convertToDetailDto(savedItem);
            return new ResponseEntity<>(
                    new ItemReopenResponseDto(true, "Item reopened successfully", itemDto),
                    HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(
                    new ItemReopenResponseDto(false, "Error reopening item: " + e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper methods
    private Sort createSort(String sortBy, String sortDir) {
        String sortField = (sortBy != null && !sortBy.isEmpty()) ? sortBy : "reportedDate";

        // Map common sort field names
        switch (sortField.toLowerCase()) {
            case "createdat":
            case "created_at":
                sortField = "reportedDate";
                break;
            case "updatedat":
            case "updated_at":
                sortField = "reportedDate"; // Using reportedDate as proxy for updatedAt
                break;
            case "title":
                sortField = "title";
                break;
            case "status":
                sortField = "status";
                break;
            case "type":
                sortField = "type";
                break;
            default:
                sortField = "reportedDate";
        }

        Sort.Direction direction = Sort.Direction.DESC;
        if (sortDir != null && sortDir.equalsIgnoreCase("ASC")) {
            direction = Sort.Direction.ASC;
        }

        return Sort.by(direction, sortField);
    }

    private Item.ItemStatus parseStatus(String status) {
        if (status == null || status.isEmpty()) {
            return null;
        }
        try {
            return Item.ItemStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private Item.ItemType parseType(String type) {
        if (type == null || type.isEmpty()) {
            return null;
        }
        try {
            return Item.ItemType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private ItemDetailDto convertToDetailDto(Item item) {
        ItemDetailDto dto = new ItemDetailDto();
        dto.setId(item.getId());
        dto.setTitle(item.getTitle());
        dto.setShortDescription(item.getShortDescription());
        dto.setFullDescription(item.getFullDescription());
        dto.setLocation(item.getLocation());
        dto.setDate(item.getDate());
        dto.setStatus(item.getStatus().name());
        dto.setCategory(item.getCategory());
        dto.setType(item.getType().name());  // Set the type field (LOST or FOUND)
        dto.setReportedBy(item.getUser().getUsername());
        dto.setReportedDate(item.getReportedDate());
        dto.setResolvedDate(item.getResolvedDate());  // Set the resolvedDate field
        dto.setContactInfo(getContactInfo(item));
        dto.setImages(item.getImages());
        dto.setAdditionalDetails(item.getAdditionalDetails());
        return dto;
    }

    private String getContactInfo(Item item) {
        UserEntity user = item.getUser();
        if (item.getContactPreference() != null) {
            switch (item.getContactPreference().toLowerCase()) {
                case "email":
                    return user.getEmail();
                case "phone":
                    return user.getPhone();
                case "both":
                    return user.getEmail() + " | " + user.getPhone();
                default:
                    return user.getEmail();
            }
        }
        return user.getEmail();
    }

    private String truncateDescription(String description) {
        if (description == null) return null;
        return description.length() > 500 ? description.substring(0, 497) + "..." : description;
    }
}
