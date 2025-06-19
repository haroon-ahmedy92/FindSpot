package com.findspot.haroon.repositories;

import com.findspot.haroon.models.Item;
import com.findspot.haroon.models.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    
    @Query("SELECT i FROM Item i WHERE i.type = :type AND " +
           "(:category IS NULL OR i.category = :category) AND " +
           "(:location IS NULL OR LOWER(i.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<Item> findByTypeAndFilters(@Param("type") Item.ItemType type,
                                   @Param("category") String category,
                                   @Param("location") String location,
                                   Pageable pageable);
    
    Page<Item> findByType(Item.ItemType type, Pageable pageable);
    
    Page<Item> findByUser(UserEntity user, Pageable pageable);
    
    // New methods for user statistics
    long countByUserAndType(UserEntity user, Item.ItemType type);
    
    long countByUserAndStatusIn(UserEntity user, List<Item.ItemStatus> statuses);
    
    // New methods for user-specific item queries
    @Query("SELECT i FROM Item i WHERE i.user = :user AND " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:type IS NULL OR i.type = :type)")
    Page<Item> findByUserWithFilters(@Param("user") UserEntity user,
                                    @Param("status") Item.ItemStatus status,
                                    @Param("type") Item.ItemType type,
                                    Pageable pageable);
    
    Page<Item> findByUserAndType(UserEntity user, Item.ItemType type, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.user = :user AND i.type = :type AND " +
           "(:status IS NULL OR i.status = :status)")
    Page<Item> findByUserAndTypeWithStatus(@Param("user") UserEntity user,
                                          @Param("type") Item.ItemType type,
                                          @Param("status") Item.ItemStatus status,
                                          Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.user = :user AND " +
           "i.status IN ('CLAIMED', 'CLOSED')")
    Page<Item> findResolvedItemsByUser(@Param("user") UserEntity user, Pageable pageable);
    
    // New counting methods for user statistics
    long countByUserAndTypeAndStatus(UserEntity user, Item.ItemType type, Item.ItemStatus status);
}