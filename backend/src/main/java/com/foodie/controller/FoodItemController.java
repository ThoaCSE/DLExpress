package com.foodie.controller;
import com.foodie.dto.ApiResponse;
import com.foodie.entity.FoodItem;
import com.foodie.repository.FoodItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;

@RestController
public class FoodItemController {
    private final FoodItemRepository repo;
    public FoodItemController(FoodItemRepository r){repo=r;}
    @GetMapping("/api/foods") public ResponseEntity<ApiResponse<List<FoodItem>>> all(){return ResponseEntity.ok(ApiResponse.ok("OK",repo.findAll()));}
    @GetMapping("/api/foods/{id}") public ResponseEntity<ApiResponse<FoodItem>> byId(@PathVariable String id){return repo.findById(id).map(f->ResponseEntity.ok(ApiResponse.ok("OK",f))).orElse(ResponseEntity.notFound().build());}
    @GetMapping("/api/foods/store/{storeId}") public ResponseEntity<ApiResponse<List<FoodItem>>> byStore(@PathVariable String storeId){return ResponseEntity.ok(ApiResponse.ok("OK",repo.findByStoreIdAndAvailable(storeId,true)));}
    @PostMapping("/api/seller/foods") public ResponseEntity<ApiResponse<FoodItem>> add(@RequestBody FoodItem f){return ResponseEntity.ok(ApiResponse.ok("Added",repo.save(f)));}
    @PutMapping("/api/seller/foods/{id}") public ResponseEntity<ApiResponse<FoodItem>> update(@PathVariable String id,@RequestBody FoodItem f){f.setId(id);return ResponseEntity.ok(ApiResponse.ok("Updated",repo.save(f)));}
    @DeleteMapping("/api/seller/foods/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id){repo.deleteById(id);return ResponseEntity.ok(ApiResponse.ok("Deleted",null));}

    @GetMapping("/api/groceries/items")
    public ResponseEntity<ApiResponse<List<FoodItem>>> groceries(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String category,
        @RequestParam(defaultValue = "80") int limit
    ) {
        List<FoodItem> rows;
        boolean hasQuery = query != null && !query.isBlank();
        boolean hasCategory = category != null && !category.isBlank() && !"All".equalsIgnoreCase(category);

        if (hasQuery && hasCategory) {
            rows = repo.findByAvailableTrueAndCategoryIgnoreCaseAndNameContainingIgnoreCaseOrderByCreatedAtDesc(category, query);
        } else if (hasQuery) {
            rows = repo.findByAvailableTrueAndNameContainingIgnoreCaseOrderByCreatedAtDesc(query);
        } else if (hasCategory) {
            rows = repo.findByAvailableTrueAndCategoryIgnoreCaseOrderByCreatedAtDesc(category);
        } else {
            rows = repo.findByAvailableTrueOrderByCreatedAtDesc();
        }

        int safeLimit = Math.max(1, Math.min(limit, 300));
        List<FoodItem> result = rows.stream().limit(safeLimit).toList();
        return ResponseEntity.ok(ApiResponse.ok("OK", result));
    }

    @GetMapping("/api/groceries/categories")
    public ResponseEntity<ApiResponse<List<String>>> categories() {
        List<String> categories = repo.findByAvailableTrueOrderByCreatedAtDesc().stream()
            .map(FoodItem::getCategory)
            .filter(v -> v != null && !v.isBlank())
            .map(v -> v.trim())
            .collect(java.util.stream.Collectors.collectingAndThen(
                java.util.stream.Collectors.toCollection(LinkedHashSet::new),
                List::copyOf
            ));

        categories = categories.stream()
            .sorted(Comparator.comparing(v -> v.toLowerCase(Locale.ROOT)))
            .toList();
        return ResponseEntity.ok(ApiResponse.ok("OK", categories));
    }

    @GetMapping("/api/groceries/featured")
    public ResponseEntity<ApiResponse<List<FoodItem>>> featured(@RequestParam(defaultValue = "16") int limit) {
        int safeLimit = Math.max(1, Math.min(limit, 60));
        List<FoodItem> rows = repo.findByAvailableTrueOrderByCreatedAtDesc().stream().limit(safeLimit).toList();
        return ResponseEntity.ok(ApiResponse.ok("OK", rows));
    }
}
