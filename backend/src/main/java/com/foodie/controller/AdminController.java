package com.foodie.controller;
import com.foodie.dto.ApiResponse;
import com.foodie.entity.*;
import com.foodie.repository.*;
import com.foodie.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepo;
    private final NotificationService notif;
    private final AccountVerifyService verifyService;
    private final PaymentRepository paymentRepo;
    private final OrderRepository orderRepo;
    private final StoreRepository storeRepo;
    private final FoodItemRepository foodRepo;
    private final NotificationRepository notifRepo;

    public AdminController(UserRepository u, NotificationService n, AccountVerifyService v,
                           PaymentRepository p, OrderRepository o, StoreRepository s,
                           FoodItemRepository f, NotificationRepository notifRepo){
        userRepo=u;notif=n;verifyService=v;paymentRepo=p;orderRepo=o;storeRepo=s;foodRepo=f;this.notifRepo=notifRepo;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> users(){ return ResponseEntity.ok(ApiResponse.ok("OK",userRepo.findAll())); }

    @PutMapping("/users/{id}/active")
    public ResponseEntity<ApiResponse<String>> setActive(@PathVariable String id,@RequestParam boolean active){
        userRepo.findById(id).ifPresent(u->{u.setActive(active);userRepo.save(u);});
        return ResponseEntity.ok(ApiResponse.ok(active?"Unlocked":"Locked",null));
    }

    @DeleteMapping("/users/{id}/hard")
    public ResponseEntity<ApiResponse<Map<String,Object>>> hardDeleteUser(@PathVariable String id){
        var userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.error("User not found"));
        }

        var user = userOpt.get();
        if (user.getRole() == UserRole.ADMIN) {
            return ResponseEntity.status(400).body(ApiResponse.error("Admin user cannot be hard deleted"));
        }

        int storesDeleted = 0;
        int foodsDeleted = 0;
        int sellerOrdersDeleted = 0;
        int buyerOrdersDeleted = 0;
        int paymentsDeleted = 0;

        if (user.getRole() == UserRole.SELLER) {
            var stores = storeRepo.findAllByOwnerId(id);
            var storeIds = stores.stream().map(Store::getId).toList();
            storesDeleted = storeIds.size();

            if (!storeIds.isEmpty()) {
                var sellerOrders = orderRepo.findByStoreIdIn(storeIds);
                var sellerOrderIds = sellerOrders.stream().map(Order::getId).toList();
                sellerOrdersDeleted = sellerOrderIds.size();

                foodsDeleted = storeIds.stream().mapToInt(storeId -> foodRepo.findByStoreId(storeId).size()).sum();

                foodRepo.deleteByStoreIdIn(storeIds);

                if (!sellerOrderIds.isEmpty()) {
                    paymentRepo.deleteByOrderIdIn(sellerOrderIds);
                    paymentsDeleted += sellerOrderIds.size();
                }

                orderRepo.deleteByStoreIdIn(storeIds);
                storeRepo.deleteByOwnerId(id);
            }
        }

        var buyerOrders = orderRepo.findByBuyerIdOrderByCreatedAtDesc(id);
        var buyerOrderIds = buyerOrders.stream().map(Order::getId).toList();
        buyerOrdersDeleted = buyerOrderIds.size();

        if (!buyerOrderIds.isEmpty()) {
            paymentRepo.deleteByOrderIdIn(buyerOrderIds);
            paymentsDeleted += buyerOrderIds.size();
        }

        paymentRepo.deleteByBuyerId(id);
        orderRepo.deleteByBuyerId(id);
        notifRepo.deleteByUserId(id);
        userRepo.deleteById(id);

        Map<String,Object> result = new LinkedHashMap<>();
        result.put("deletedUserId", id);
        result.put("role", user.getRole().name());
        result.put("storesDeleted", storesDeleted);
        result.put("foodsDeleted", foodsDeleted);
        result.put("sellerOrdersDeleted", sellerOrdersDeleted);
        result.put("buyerOrdersDeleted", buyerOrdersDeleted);
        result.put("paymentsDeletedApprox", paymentsDeleted);
        return ResponseEntity.ok(ApiResponse.ok("User permanently deleted from MongoDB", result));
    }

    // v5.2: list pending deletion requests
    @GetMapping("/deletion-requests")
    public ResponseEntity<ApiResponse<List<User>>> deletionRequests(){
        return ResponseEntity.ok(ApiResponse.ok("OK",userRepo.findByDeletionRequestedTrue()));
    }

    // v5.2: admin reviews account deletion with verify flags
    @GetMapping("/deletion-requests/{userId}/verify")
    public ResponseEntity<ApiResponse<Map<String,Object>>> verifyDeletion(@PathVariable String userId){
        var flags = verifyService.getFlags(userId);
        var user = userRepo.findById(userId).orElseThrow();
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("userId", userId);
        result.put("fullName", user.getFullName());
        result.put("email", user.getEmail());
        result.put("safeToDelete", flags.isEmpty());
        result.put("flags", flags);
        return ResponseEntity.ok(ApiResponse.ok("OK",result));
    }

    @PostMapping("/deletion-requests/{userId}/approve")
    public ResponseEntity<ApiResponse<String>> approveDeletion(@PathVariable String userId, @RequestBody(required=false) Map<String,String> body){
        userRepo.findById(userId).ifPresent(u->{
            u.setDeletionStatus("APPROVED");
            u.setDeletionReviewNote(body!=null?body.getOrDefault("note","Approved by admin"):"Approved by admin");
            u.setActive(false);
            userRepo.save(u);
            notif.send(userId,"Account Deletion Approved","Your deletion request has been approved. Account is now deactivated.","SYSTEM",null);
        });
        return ResponseEntity.ok(ApiResponse.ok("Deletion approved",null));
    }

    @PostMapping("/deletion-requests/{userId}/reject")
    public ResponseEntity<ApiResponse<String>> rejectDeletion(@PathVariable String userId, @RequestBody(required=false) Map<String,String> body){
        userRepo.findById(userId).ifPresent(u->{
            u.setDeletionRequested(false);
            u.setDeletionStatus("REJECTED");
            u.setDeletionReviewNote(body!=null?body.getOrDefault("reason","Rejected by admin — unresolved issues"):"Rejected");
            userRepo.save(u);
            notif.send(userId,"Account Deletion Rejected","Reason: "+u.getDeletionReviewNote(),"SYSTEM",null);
        });
        return ResponseEntity.ok(ApiResponse.ok("Deletion rejected",null));
    }

    @PostMapping("/notify/{uid}")
    public ResponseEntity<ApiResponse<Void>> adminNotify(@PathVariable String uid,@RequestBody Map<String,String> body){
        notif.send(uid,body.getOrDefault("title","Notice"),body.getOrDefault("message",""),"SYSTEM",null);
        return ResponseEntity.ok(ApiResponse.ok("Sent",null));
    }

    // DB viewer endpoints
    @GetMapping("/db/payments") public ResponseEntity<ApiResponse<?>> allPayments(){ return ResponseEntity.ok(ApiResponse.ok("OK",paymentRepo.findAllByOrderByCreatedAtDesc())); }
    @GetMapping("/db/notifications") public ResponseEntity<ApiResponse<?>> allNotifs(){ return ResponseEntity.ok(ApiResponse.ok("OK",notif.getAll())); }
}
