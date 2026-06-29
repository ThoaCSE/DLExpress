package com.foodie.config;
import com.foodie.entity.User;
import com.foodie.entity.UserRole;
import com.foodie.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    public DataSeeder(UserRepository userRepo, PasswordEncoder encoder) {
        this.userRepo=userRepo; this.encoder=encoder;
    }
    @Override
    public void run(String... args) {
        if (userRepo.findByEmail("admin@dlexpress.com").isEmpty()) {
            User admin = new User();
            admin.setFullName("System Admin");
            admin.setEmail("admin@dlexpress.com");
            admin.setPassword(encoder.encode("Admin@123"));
            admin.setRole(UserRole.ADMIN);
            admin.setActive(true);
            userRepo.save(admin);
            System.out.println("[DLExpress] Admin account seeded: admin@dlexpress.com / Admin@123");
        }
    }
}
