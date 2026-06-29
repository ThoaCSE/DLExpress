package com.foodie.controller;
import com.foodie.dto.ApiResponse;
import com.foodie.entity.FoodItem;
import com.foodie.repository.FoodItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class FoodItemController {
    private final FoodItemRepository repo;
    public FoodItemController(FoodItemRepository r){repo=r;}
    @GetMapping("/api/foods") public ResponseEntity<ApiResponse<List<FoodItem>>> all(){return ResponseEntity.ok(ApiResponse.ok("OK",repo.findAll()));}
    @GetMapping("/api/foods/store/{storeId}") public ResponseEntity<ApiResponse<List<FoodItem>>> byStore(@PathVariable String storeId){return ResponseEntity.ok(ApiResponse.ok("OK",repo.findByStoreIdAndAvailable(storeId,true)));}
    @PostMapping("/api/seller/foods") public ResponseEntity<ApiResponse<FoodItem>> add(@RequestBody FoodItem f){return ResponseEntity.ok(ApiResponse.ok("Added",repo.save(f)));}
    @PutMapping("/api/seller/foods/{id}") public ResponseEntity<ApiResponse<FoodItem>> update(@PathVariable String id,@RequestBody FoodItem f){f.setId(id);return ResponseEntity.ok(ApiResponse.ok("Updated",repo.save(f)));}
    @DeleteMapping("/api/seller/foods/{id}") public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id){repo.deleteById(id);return ResponseEntity.ok(ApiResponse.ok("Deleted",null));}
}
