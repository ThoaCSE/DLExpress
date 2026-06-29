package com.foodie.controller;
import com.foodie.dto.*;
import com.foodie.entity.Order;
import com.foodie.entity.Payment;
import com.foodie.repository.OrderRepository;
import com.foodie.repository.PaymentRepository;
import com.foodie.service.NotificationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController @RequestMapping("/api/buyer/payment")
public class PaymentController {
    private final OrderRepository orderRepo;
    private final PaymentRepository paymentRepo;
    private final NotificationService notifSvc;
    @Value("${razorpay.key.id:demo_key}") private String rzpKey;

    public PaymentController(OrderRepository orderRepo, PaymentRepository paymentRepo, NotificationService notifSvc) {
        this.orderRepo=orderRepo; this.paymentRepo=paymentRepo; this.notifSvc=notifSvc;
    }

    /** Step 1: create payment intent for CARD/QR via Razorpay, or confirm CASH directly */
    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<Map<String,Object>>> initiate(@RequestBody Map<String,String> body) {
        String orderId = body.get("orderId");
        String method = body.getOrDefault("method","CASH").toUpperCase();
        Order order = orderRepo.findById(orderId).orElseThrow(()->new RuntimeException("Order not found"));
        order.setPaymentMethod(method);

        Map<String,Object> resp = new HashMap<>();
        resp.put("method", method);
        resp.put("amount", order.getTotalAmount());
        resp.put("orderId", orderId);

        if ("CASH".equals(method)) {
            // Cash: payment confirmed when delivered
            Payment p = Payment.builder().orderId(orderId).buyerId(order.getBuyerId())
                .amount(order.getTotalAmount()).method("CASH").status("PENDING")
                .transactionRef("COD-"+orderId.substring(0,6)).build();
            paymentRepo.save(p); orderRepo.save(order);
            resp.put("status","CASH_ON_DELIVERY");
            resp.put("message","Cash on delivery — pay driver when food arrives.");
        } else {
            // CARD or QR → Razorpay order
            String rzpOrderId = "order_"+UUID.randomUUID().toString().replace("-","").substring(0,14);
            order.setRazorpayOrderId(rzpOrderId); orderRepo.save(order);
            Payment p = Payment.builder().orderId(orderId).buyerId(order.getBuyerId())
                .amount(order.getTotalAmount()).method(method).status("PENDING")
                .transactionRef(rzpOrderId).build();
            paymentRepo.save(p);
            resp.put("razorpayOrderId", rzpOrderId);
            resp.put("key", rzpKey);
            resp.put("demo", "demo_key".equals(rzpKey));
        }
        return ResponseEntity.ok(ApiResponse.ok("Payment initiated", resp));
    }

    /** Step 2: verify CARD/QR after Razorpay callback */
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Order>> verify(@RequestBody PaymentVerifyRequest req) {
        Order order = orderRepo.findById(req.getOrderId()).orElseThrow();
        String payId = req.getRazorpayPaymentId()!=null ? req.getRazorpayPaymentId() : "demo_"+UUID.randomUUID().toString().substring(0,8);
        order.setPaymentStatus("PAID"); order.setPaymentId(payId);
        if (!"PENDING".equals(order.getStatus())) {} else { order.setStatus("PAID"); }
        orderRepo.save(order);
        paymentRepo.findByOrderId(req.getOrderId()).ifPresent(p->{
            p.setStatus("SUCCESS"); p.setTransactionRef(payId); p.setPaidAt(LocalDateTime.now()); paymentRepo.save(p);
        });
        notifSvc.send(order.getBuyerId(),"Payment Successful",
            "Payment of Rs."+order.getTotalAmount()+" confirmed. Method: "+order.getPaymentMethod(),"PAYMENT",order.getId());
        return ResponseEntity.ok(ApiResponse.ok("Verified", order));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Payment>>> history(
        @RequestHeader(value="X-User-Id",required=false) String uid) {
        return ResponseEntity.ok(ApiResponse.ok("OK", paymentRepo.findByBuyerId(uid)));
    }
}
