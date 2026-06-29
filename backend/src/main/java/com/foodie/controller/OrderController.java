package com.foodie.controller;
import com.foodie.dto.*;
import com.foodie.entity.Order;
import com.foodie.entity.Store;
import com.foodie.repository.*;
import com.foodie.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
public class OrderController {
    private final OrderRepository orderRepo;
    private final StoreRepository storeRepo;
    private final NotificationService notif;

    public OrderController(OrderRepository o, StoreRepository s, NotificationService n){ orderRepo=o;storeRepo=s;notif=n; }

    @PostMapping("/api/buyer/orders")
    public ResponseEntity<ApiResponse<Order>> place(@RequestBody OrderRequest req,
        @RequestHeader(value="X-User-Id",required=false) String uid) {
        double sLat=48.1351,sLng=11.5820;
        var so=storeRepo.findById(req.getStoreId());
        if(so.isPresent()){sLat=so.get().getLat();sLng=so.get().getLng();}
        Order o=Order.builder().buyerId(uid).storeId(req.getStoreId()).items(req.getItems())
            .totalAmount(req.getTotalAmount()).status("PENDING").paymentMethod(req.getPaymentMethod())
            .deliveryAddress(req.getDeliveryAddress()).deliveryLat(req.getDeliveryLat())
            .deliveryLng(req.getDeliveryLng()).storeLat(sLat).storeLng(sLng).build();
        orderRepo.save(o);
        if(uid!=null) notif.send(uid,"Order Placed","Order #"+o.getId().substring(0,6)+" placed! Rs."+req.getTotalAmount(),"ORDER_STATUS",o.getId());
        return ResponseEntity.ok(ApiResponse.ok("Order placed",o));
    }

    @GetMapping("/api/buyer/orders")
    public ResponseEntity<ApiResponse<List<Order>>> mine(@RequestHeader(value="X-User-Id",required=false) String uid){
        return ResponseEntity.ok(ApiResponse.ok("OK",orderRepo.findByBuyerIdOrderByCreatedAtDesc(uid)));
    }

    @GetMapping("/api/buyer/orders/{id}")
    public ResponseEntity<ApiResponse<Order>> getOne(@PathVariable String id){
        return orderRepo.findById(id).map(o->ResponseEntity.ok(ApiResponse.ok("OK",o))).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/seller/orders")
    public ResponseEntity<ApiResponse<List<Order>>> sellerOrders(@RequestHeader(value="X-User-Id",required=false) String uid){
        var stores=storeRepo.findAllByOwnerId(uid);
        var ids=stores.stream().map(Store::getId).toList();
        return ResponseEntity.ok(ApiResponse.ok("OK",orderRepo.findByStoreIdIn(ids)));
    }

    @PutMapping("/api/seller/orders/{id}/status")
    public ResponseEntity<ApiResponse<Order>> sellerStatus(@PathVariable String id,@RequestParam String status){
        return orderRepo.findById(id).map(o->{
            o.setStatus(status); orderRepo.save(o);
            notif.send(o.getBuyerId(),"Order Update","Your order is now: "+status,"ORDER_STATUS",id);
            return ResponseEntity.ok(ApiResponse.ok("Updated",o));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/admin/orders")
    public ResponseEntity<ApiResponse<List<Order>>> adminAll(){
        return ResponseEntity.ok(ApiResponse.ok("OK",orderRepo.findAllByOrderByCreatedAtDesc()));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<ApiResponse<Order>> adminStatus(@PathVariable String id,@RequestParam String status){
        return orderRepo.findById(id).map(o->{
            o.setStatus(status); orderRepo.save(o);
            notif.send(o.getBuyerId(),"Admin Update","Admin set order to: "+status,"ORDER_STATUS",id);
            return ResponseEntity.ok(ApiResponse.ok("Updated",o));
        }).orElse(ResponseEntity.notFound().build());
    }
}
