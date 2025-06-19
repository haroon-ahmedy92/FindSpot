package com.findspot.haroon.repositories;

import com.findspot.haroon.models.SavedItem;
import com.findspot.haroon.models.UserEntity;
import com.findspot.haroon.models.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
    Optional<SavedItem> findByUserAndItem(UserEntity user, Item item);
    Page<SavedItem> findByUser(UserEntity user, Pageable pageable);
    List<SavedItem> findByItem(Item item);
    boolean existsByUserAndItem(UserEntity user, Item item);
    void deleteByUserAndItem(UserEntity user, Item item);
    long countByUser(UserEntity user);
}