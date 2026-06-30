package com.foodie.config;

import com.foodie.entity.FoodItem;
import com.foodie.entity.Store;
import com.foodie.entity.User;
import com.foodie.entity.UserRole;
import com.foodie.repository.FoodItemRepository;
import com.foodie.repository.StoreRepository;
import com.foodie.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Component
public class GroceriesSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final StoreRepository storeRepo;
    private final FoodItemRepository foodRepo;
    private final PasswordEncoder encoder;

    public GroceriesSeeder(UserRepository userRepo, StoreRepository storeRepo, FoodItemRepository foodRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.storeRepo = storeRepo;
        this.foodRepo = foodRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        User seller = userRepo.findByEmail("grocery@dlexpress.com").orElseGet(() -> {
            User u = new User();
            u.setFullName("Groceries Partner");
            u.setEmail("grocery@dlexpress.com");
            u.setPassword(encoder.encode("Grocery@123"));
            u.setRole(UserRole.SELLER);
            u.setActive(true);
            return userRepo.save(u);
        });

        Store store = storeRepo.findByOwnerId(seller.getId()).orElseGet(() -> {
            Store s = new Store();
            s.setOwnerId(seller.getId());
            s.setName("DLExpress Groceries Hub");
            s.setDescription("Groceries imported from partner catalogs");
            s.setCategory("Groceries");
            s.setApproved(true);
            s.setImageUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop");
            return storeRepo.save(s);
        });

        List<FoodItem> existing = foodRepo.findByStoreId(store.getId());
        if (existing.size() >= 300) {
            return;
        }

        Set<String> knownNames = new LinkedHashSet<>();
        for (FoodItem item : existing) {
            if (item.getName() != null) {
                knownNames.add(item.getName().trim().toLowerCase(Locale.ROOT));
            }
        }

        List<FoodItem> toSave = new ArrayList<>();
        importBigBasket(store.getId(), knownNames, toSave, 220);
        importWalmart(store.getId(), knownNames, toSave, 120);

        if (!toSave.isEmpty()) {
            foodRepo.saveAll(toSave);
            System.out.println("[DLExpress] Seeded groceries items: " + toSave.size());
        }
    }

    private void importBigBasket(String storeId, Set<String> knownNames, List<FoodItem> out, int max) {
        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(new ClassPathResource("datasets/BigBasket_preprocessed.csv").getInputStream(), StandardCharsets.UTF_8))) {

            String header = reader.readLine();
            if (header == null) return;
            Map<String, Integer> idx = headerIndex(header);

            String line;
            while ((line = reader.readLine()) != null && out.size() < max) {
                List<String> row = parseCsvLine(line);
                String name = get(row, idx, "name");
                if (name == null || name.isBlank()) continue;
                String key = name.trim().toLowerCase(Locale.ROOT);
                if (knownNames.contains(key)) continue;

                double price = parsePrice(get(row, idx, "price"));
                if (price <= 0) continue;

                FoodItem item = new FoodItem();
                item.setStoreId(storeId);
                item.setName(trimTo(name, 180));
                item.setDescription(trimTo(get(row, idx, "description"), 360));
                item.setImageUrl(get(row, idx, "imgUrl"));
                item.setPrice(price);
                item.setOriginalPrice(round2(price * 1.12));
                item.setCategory(emptyTo(get(row, idx, "category"), "Groceries"));
                item.setBrand("BigBasket");
                item.setUnit("pack");
                item.setMarket("BigBasket");
                item.setTags(Arrays.asList("Groceries", item.getCategory(), "Imported"));
                item.setAvailable(true);

                out.add(item);
                knownNames.add(key);
            }
        } catch (Exception ignored) {
            // Seeder is best-effort only
        }
    }

    private void importWalmart(String storeId, Set<String> knownNames, List<FoodItem> out, int max) {
        try (BufferedReader reader = new BufferedReader(
            new InputStreamReader(new ClassPathResource("datasets/walmart-products.csv").getInputStream(), StandardCharsets.UTF_8))) {

            String header = reader.readLine();
            if (header == null) return;
            Map<String, Integer> idx = headerIndex(header);

            String line;
            while ((line = reader.readLine()) != null && out.size() < (220 + max)) {
                List<String> row = parseCsvLine(line);
                String name = emptyTo(get(row, idx, "product_name"), get(row, idx, "name"));
                if (name == null || name.isBlank()) continue;
                String key = name.trim().toLowerCase(Locale.ROOT);
                if (knownNames.contains(key)) continue;

                double price = parsePrice(emptyTo(get(row, idx, "final_price"), get(row, idx, "price")));
                if (price <= 0) continue;

                String category = emptyTo(get(row, idx, "category_name"), "Groceries");
                String image = emptyTo(get(row, idx, "main_image"), get(row, idx, "image_urls"));
                String brand = emptyTo(get(row, idx, "brand"), "Walmart");

                FoodItem item = new FoodItem();
                item.setStoreId(storeId);
                item.setName(trimTo(name, 180));
                item.setDescription(trimTo(get(row, idx, "description"), 360));
                item.setImageUrl(firstUrl(image));
                item.setPrice(price);
                item.setOriginalPrice(round2(price * 1.08));
                item.setCategory(trimTo(category, 80));
                item.setBrand(trimTo(brand, 80));
                item.setUnit(emptyTo(get(row, idx, "unit"), "pcs"));
                item.setMarket("Walmart");
                item.setTags(Arrays.asList("Groceries", item.getCategory(), "Walmart"));
                item.setAvailable(true);

                out.add(item);
                knownNames.add(key);
            }
        } catch (Exception ignored) {
            // Seeder is best-effort only
        }
    }

    private Map<String, Integer> headerIndex(String header) {
        List<String> cols = parseCsvLine(header);
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < cols.size(); i++) {
            map.put(cols.get(i).trim(), i);
        }
        return map;
    }

    private String get(List<String> row, Map<String, Integer> idx, String key) {
        Integer i = idx.get(key);
        if (i == null || i < 0 || i >= row.size()) return null;
        String val = row.get(i);
        return val == null ? null : val.trim();
    }

    private String emptyTo(String value, String fallback) {
        if (value == null || value.isBlank()) return fallback;
        return value;
    }

    private String trimTo(String value, int max) {
        if (value == null) return null;
        String cleaned = value.replaceAll("\\s+", " ").trim();
        return cleaned.length() <= max ? cleaned : cleaned.substring(0, max);
    }

    private String firstUrl(String value) {
        if (value == null || value.isBlank()) return null;
        String cleaned = value.replace("[", "").replace("]", "").replace("\"", "").trim();
        if (cleaned.contains(",")) {
            return cleaned.substring(0, cleaned.indexOf(',')).trim();
        }
        return cleaned;
    }

    private double parsePrice(String raw) {
        if (raw == null || raw.isBlank()) return 0;
        String normalized = raw.replaceAll("[^0-9eE+\\-.]", "");
        if (normalized.isBlank()) return 0;
        try {
            return Double.parseDouble(normalized);
        } catch (Exception ignored) {
            return 0;
        }
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private List<String> parseCsvLine(String line) {
        List<String> result = new ArrayList<>();
        if (line == null) return result;

        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    current.append('"');
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                result.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }

        result.add(current.toString());
        return result;
    }
}
