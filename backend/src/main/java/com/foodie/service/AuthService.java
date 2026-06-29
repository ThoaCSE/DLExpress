package com.foodie.service;
import com.foodie.dto.*;
import com.foodie.entity.*;
import com.foodie.repository.UserRepository;
import com.foodie.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwt) {
        this.userRepo=userRepo; this.encoder=encoder; this.jwt=jwt;
    }

    public AuthResponse register(RegisterRequest req) {
        if (req.getRole()==UserRole.ADMIN) throw new RuntimeException("Cannot register as ADMIN.");
        if (userRepo.findByEmail(req.getEmail()).isPresent()) throw new RuntimeException("Email already registered.");
        User u = new User();
        u.setFullName(req.getFullName()); u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setPhone(req.getPhone()); u.setAddress(req.getAddress());
        u.setRole(req.getRole()!=null?req.getRole():UserRole.BUYER);
        userRepo.save(u);
        return buildResponse(u, jwt.generate(u.getEmail()));
    }

    public AuthResponse login(LoginRequest req) {
        User u = userRepo.findByEmail(req.getEmail()).orElseThrow(()->new RuntimeException("Invalid email or password."));
        if (!u.isActive()) throw new RuntimeException("Account is locked.");
        if (!encoder.matches(req.getPassword(), u.getPassword())) throw new RuntimeException("Invalid email or password.");
        u.setLastLogin(LocalDateTime.now()); userRepo.save(u);
        return buildResponse(u, jwt.generate(u.getEmail()));
    }

    private AuthResponse buildResponse(User u, String token) {
        return AuthResponse.builder().token(token).userId(u.getId())
            .fullName(u.getFullName()).email(u.getEmail()).role(u.getRole()).build();
    }
}
