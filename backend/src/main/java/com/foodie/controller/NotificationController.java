package com.foodie.controller;
import com.foodie.dto.ApiResponse;
import com.foodie.entity.Notification;
import com.foodie.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService svc;
    public NotificationController(NotificationService s){svc=s;}
    @GetMapping("/{uid}") public ResponseEntity<ApiResponse<List<Notification>>> get(@PathVariable String uid){return ResponseEntity.ok(ApiResponse.ok("OK",svc.getForUser(uid)));}
    @GetMapping("/{uid}/unread-count") public ResponseEntity<ApiResponse<Map<String,Long>>> count(@PathVariable String uid){return ResponseEntity.ok(ApiResponse.ok("OK",Map.of("count",svc.countUnread(uid))));}
    @PutMapping("/{id}/read") public ResponseEntity<ApiResponse<Void>> read(@PathVariable String id){svc.markRead(id);return ResponseEntity.ok(ApiResponse.ok("OK",null));}
    @PutMapping("/user/{uid}/read-all") public ResponseEntity<ApiResponse<Void>> readAll(@PathVariable String uid){svc.markAllRead(uid);return ResponseEntity.ok(ApiResponse.ok("OK",null));}
}
