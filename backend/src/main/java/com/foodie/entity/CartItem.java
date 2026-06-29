package com.foodie.entity;

public class CartItem {
    private String foodItemId;
    private String name;
    private double price;
    private int quantity;

    public String getFoodItemId() { return foodItemId; }
    public void setFoodItemId(String v) { foodItemId = v; }
    public String getName() { return name; }
    public void setName(String v) { name = v; }
    public double getPrice() { return price; }
    public void setPrice(double v) { price = v; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int v) { quantity = v; }
}
