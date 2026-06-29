package com.foodie.controller;
import com.foodie.dto.ApiResponse;
import com.foodie.entity.Store;
import com.foodie.repository.StoreRepository;
import com.foodie.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class StoreController {
    private final StoreRepository storeRepo;
    private final NotificationService notif;
    public StoreController(StoreRepository s, NotificationService n){storeRepo=s;notif=n;}

    @GetMapping("/api/stores")
    public ResponseEntity<ApiResponse<List<Store>>> approved(){return ResponseEntity.ok(ApiResponse.ok("OK",storeRepo.findByApproved(true)));}

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
