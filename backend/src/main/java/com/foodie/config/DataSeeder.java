package com.foodie.config;
import com.foodie.entity.Store;
import com.foodie.entity.User;
import com.foodie.entity.UserRole;
import com.foodie.repository.StoreRepository;
import com.foodie.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepo;
    private final StoreRepository storeRepo;
    private final PasswordEncoder encoder;
    public DataSeeder(UserRepository userRepo, StoreRepository storeRepo, PasswordEncoder encoder) {
        this.userRepo=userRepo; this.storeRepo=storeRepo; this.encoder=encoder;
    }
    @Override
    public void run(String... args) {
        // Admin cheat account
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

        // Buyer cheat account (pre-approved, active)
        if (userRepo.findByEmail("buyer@dlexpress.com").isEmpty()) {
            User buyer = new User();
            buyer.setFullName("Demo Buyer");
            buyer.setEmail("buyer@dlexpress.com");
            buyer.setPassword(encoder.encode("Buyer@123"));
            buyer.setRole(UserRole.BUYER);
            buyer.setActive(true);
            buyer.setPhone("0123456789");
            buyer.setAddress("123 Demo Street, City");
            userRepo.save(buyer);
            System.out.println("[DLExpress] Buyer cheat account seeded: buyer@dlexpress.com / Buyer@123");
        }

        // Seller cheat account (pre-approved, active) with an approved store
        User seller = userRepo.findByEmail("seller@dlexpress.com").orElseGet(() -> {
            User u = new User();
            u.setFullName("Demo Seller");
            u.setEmail("seller@dlexpress.com");
            u.setPassword(encoder.encode("Seller@123"));
            u.setRole(UserRole.SELLER);
            u.setActive(true);
            u.setPhone("0987654321");
            u.setAddress("456 Shop Avenue, City");
            User saved = userRepo.save(u);
            System.out.println("[DLExpress] Seller cheat account seeded: seller@dlexpress.com / Seller@123");
            return saved;
        });

        if (storeRepo.findByOwnerId(seller.getId()).isEmpty()) {
            Store store = new Store();
            store.setOwnerId(seller.getId());
            store.setName("Demo Store");
            store.setDescription("A pre-approved demo store for screenshots");
            store.setCategory("Food");
            store.setApproved(true);
            store.setImageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop");
            storeRepo.save(store);
            System.out.println("[DLExpress] Demo Store seeded for seller@dlexpress.com");
        }
    }
}
