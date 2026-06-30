package com.foodie.repository;
import com.foodie.entity.FoodItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface FoodItemRepository extends MongoRepository<FoodItem,String> {
    List<FoodItem> findByStoreIdAndAvailable(String storeId, boolean available);
    List<FoodItem> findByStoreId(String storeId);
    List<FoodItem> findByAvailableTrueOrderByCreatedAtDesc();
    List<FoodItem> findByAvailableTrueAndCategoryIgnoreCaseOrderByCreatedAtDesc(String category);
    List<FoodItem> findByAvailableTrueAndNameContainingIgnoreCaseOrderByCreatedAtDesc(String name);
    List<FoodItem> findByAvailableTrueAndCategoryIgnoreCaseAndNameContainingIgnoreCaseOrderByCreatedAtDesc(String category, String name);
    void deleteByStoreIdIn(List<String> storeIds);
}
