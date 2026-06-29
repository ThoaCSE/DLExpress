package com.foodie.controller;
import com.foodie.dto.*;
import com.foodie.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AuthService svc;
    public AuthController(AuthService svc){this.svc=svc;}

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest req) {
        try { return ResponseEntity.ok(ApiResponse.ok("Registered", svc.register(req))); }
        catch(Exception e) { return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage())); }
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest req) {
        try { return ResponseEntity.ok(ApiResponse.ok("Login OK", svc.login(req))); }
        catch(Exception e) { return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage())); }
    }
}
