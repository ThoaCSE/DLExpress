package com.foodie.controller;
import com.foodie.dto.*;
import com.foodie.repository.UserRepository;
import com.foodie.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController @RequestMapping("/api/account")
public class AccountController {
    private final UserRepository userRepo;
    private final NotificationService notif;
    public AccountController(UserRepository u, NotificationService n){userRepo=u;notif=n;}

    // v6: user requests account deletion
    @PostMapping("/request-deletion")
    public ResponseEntity<ApiResponse<String>> requestDeletion(
        @RequestHeader(value="X-User-Id",required=false) String uid,
        @RequestBody DeletionRequest req) {
        userRepo.findById(uid).ifPresent(u->{
            u.setDeletionRequested(true);
            u.setDeletionReason(req.getReason());
            u.setDeletionRequestedAt(LocalDateTime.now());
            u.setDeletionStatus("PENDING");
            userRepo.save(u);
            notif.send(uid,"Deletion Request Received","Your account deletion request is under review.","SYSTEM",null);
        });
        return ResponseEntity.ok(ApiResponse.ok("Request submitted. Admin will review and notify you.",null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> me(@RequestHeader(value = "X-User-Id", required = false) String uid) {
        return userRepo.findById(uid)
                .map(u -> ResponseEntity.ok(ApiResponse.ok("OK", (Object) u)))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.error("User not found")));
    }
}
