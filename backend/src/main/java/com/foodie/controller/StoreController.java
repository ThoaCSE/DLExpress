package com.foodie.controller;
import com.foodie.dto.ApiResponse;
import com.foodie.entity.UserRole;
import com.foodie.entity.Store;
import com.foodie.repository.FoodItemRepository;
import com.foodie.repository.StoreRepository;
import com.foodie.repository.UserRepository;
import com.foodie.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
public class StoreController {
    private final StoreRepository storeRepo;
    private final NotificationService notif;
    private final UserRepository userRepo;
    private final FoodItemRepository foodRepo;

    public StoreController(StoreRepository s, NotificationService n, UserRepository userRepo, FoodItemRepository foodRepo){
        storeRepo=s;notif=n;this.userRepo=userRepo;this.foodRepo=foodRepo;
    }

    @GetMapping("/api/stores")
    public ResponseEntity<ApiResponse<List<Store>>> approved(){return ResponseEntity.ok(ApiResponse.ok("OK",storeRepo.findByApproved(true)));}

    @GetMapping("/api/promotions")
    public ResponseEntity<ApiResponse<List<Map<String,Object>>>> promotions(){
        var stores = storeRepo.findByApproved(true);
        var activeSellerIds = userRepo.findByActiveTrue().stream()
            .filter(u -> u.getRole() == UserRole.SELLER)
            .map(u -> u.getId())
            .collect(java.util.stream.Collectors.toSet());

        var promo = stores.stream()
            .filter(s -> s.getOwnerId() != null && activeSellerIds.contains(s.getOwnerId()))
            .filter(s -> !foodRepo.findByStoreIdAndAvailable(s.getId(), true).isEmpty())
            .limit(8)
            .map(s -> {
                Map<String,Object> m = new LinkedHashMap<>();
                m.put("id", s.getId());
                m.put("storeId", s.getId());
                m.put("storeName", s.getName());
                m.put("title", (s.getName() == null ? "Store" : s.getName()) + " bundle deal");
                m.put("subtitle", "Trending picks in " + (s.getCategory() == null ? "General" : s.getCategory()));
                m.put("badge", "Seller Promo");
                m.put("category", s.getCategory());
                m.put("imageUrl", s.getImageUrl());
                return m;
            })
            .toList();

        return ResponseEntity.ok(ApiResponse.ok("OK", promo));
    }

    @PostMapping("/api/seller/store")
    public ResponseEntity<ApiResponse<Store>> create(@RequestBody Store s){
        s.setApproved(false); storeRepo.save(s);
        return ResponseEntity.ok(ApiResponse.ok("Store created, pending admin approval",s));
    }
    @GetMapping("/api/seller/store/{ownerId}")
    public ResponseEntity<ApiResponse<Store>> getByOwner(@PathVariable String ownerId){
        return storeRepo.findByOwnerId(ownerId).map(s->ResponseEntity.ok(ApiResponse.ok("OK",s))).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/api/seller/store/{id}")
    public ResponseEntity<ApiResponse<Store>> update(@PathVariable String id,@RequestBody Store s){
        s.setId(id); return ResponseEntity.ok(ApiResponse.ok("Updated",storeRepo.save(s)));
    }
    @GetMapping("/api/admin/stores")
    public ResponseEntity<ApiResponse<List<Store>>> adminAll(){return ResponseEntity.ok(ApiResponse.ok("OK",storeRepo.findAll()));}

    @PutMapping("/api/admin/stores/{id}/approve")
    public ResponseEntity<ApiResponse<Store>> approve(@PathVariable String id){
        return storeRepo.findById(id).map(s->{
            s.setApproved(true); storeRepo.save(s);
            notif.send(s.getOwnerId(),"Store Approved","Your store '"+s.getName()+"' is now live!","SYSTEM",id);
            return ResponseEntity.ok(ApiResponse.ok("Approved",s));
        }).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/api/admin/stores/{id}/reject")
    public ResponseEntity<ApiResponse<Store>> reject(@PathVariable String id){
        return storeRepo.findById(id).map(s->{
            s.setApproved(false); storeRepo.save(s);
            notif.send(s.getOwnerId(),"Store Rejected","Your store '"+s.getName()+"' was rejected.","SYSTEM",id);
            return ResponseEntity.ok(ApiResponse.ok("Rejected",s));
        }).orElse(ResponseEntity.notFound().build());
    }
}
