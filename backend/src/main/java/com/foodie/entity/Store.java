package com.foodie.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "stores")
public class Store {
    @Id private String id;
    private String ownerId;
    private String name;
    private String description;
    private String category;
    private String imageUrl;
    private boolean approved = false;
    private double lat = 48.1351;
    private double lng = 11.5820;
    private LocalDateTime createdAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String v) { ownerId = v; }
    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { description = v; }
    public String getCategory() { return category; }
    public void setCategory(String v) { category = v; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String v) { imageUrl = v; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean v) { approved = v; }
    public double getLat() { return lat; }
    public void setLat(double v) { lat = v; }
    public double getLng() { return lng; }
    public void setLng(double v) { lng = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt = v; }
}
