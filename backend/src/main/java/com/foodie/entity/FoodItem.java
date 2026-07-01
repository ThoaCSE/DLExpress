package com.foodie.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "goods")
public class FoodItem {
    @Id private String id;
    private String storeId;
    private String name;
    private String description;
    private double price;
    private String category;
    private String imageUrl;
    private String brand;
    private String unit;
    private String market;
    private Double originalPrice;
    private List<String> tags;
    private boolean available = true;
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStoreId() { return storeId; }
    public void setStoreId(String v) { storeId = v; }
    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { description = v; }
    public double getPrice() { return price; }
    public void setPrice(double v) { price = v; }
    public String getCategory() { return category; }
    public void setCategory(String v) { category = v; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String v) { imageUrl = v; }
    public String getBrand() { return brand; }
    public void setBrand(String v) { brand = v; }
    public String getUnit() { return unit; }
    public void setUnit(String v) { unit = v; }
    public String getMarket() { return market; }
    public void setMarket(String v) { market = v; }
    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double v) { originalPrice = v; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> v) { tags = v; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean v) { available = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt = v; }
}
