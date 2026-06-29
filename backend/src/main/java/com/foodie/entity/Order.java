package com.foodie.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id private String id;
    private String buyerId;
    private String storeId;
    private List<CartItem> items;
    private double totalAmount;
    private String status = "PENDING";
    private String paymentMethod; // CASH | CARD | QR
    private String paymentStatus = "PENDING"; // PENDING | PAID
    private String paymentId;
    private String razorpayOrderId;
    private String deliveryAddress;
    private double deliveryLat;
    private double deliveryLng;
    private double storeLat = 48.1351;
    private double storeLng = 11.5820;
    private String estimatedDelivery;
    private LocalDateTime createdAt = LocalDateTime.now();

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Order o = new Order();
        public Builder buyerId(String v) { o.buyerId=v; return this; }
        public Builder storeId(String v) { o.storeId=v; return this; }
        public Builder items(List<CartItem> v) { o.items=v; return this; }
        public Builder totalAmount(double v) { o.totalAmount=v; return this; }
        public Builder status(String v) { o.status=v; return this; }
        public Builder paymentMethod(String v) { o.paymentMethod=v; return this; }
        public Builder deliveryAddress(String v) { o.deliveryAddress=v; return this; }
        public Builder deliveryLat(double v) { o.deliveryLat=v; return this; }
        public Builder deliveryLng(double v) { o.deliveryLng=v; return this; }
        public Builder storeLat(double v) { o.storeLat=v; return this; }
        public Builder storeLng(double v) { o.storeLng=v; return this; }
        public Order build() { return o; }
    }

    public String getId() { return id; }
    public void setId(String v) { id=v; }
    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String v) { buyerId=v; }
    public String getStoreId() { return storeId; }
    public void setStoreId(String v) { storeId=v; }
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> v) { items=v; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double v) { totalAmount=v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { status=v; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String v) { paymentMethod=v; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String v) { paymentStatus=v; }
    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String v) { paymentId=v; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String v) { razorpayOrderId=v; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String v) { deliveryAddress=v; }
    public double getDeliveryLat() { return deliveryLat; }
    public void setDeliveryLat(double v) { deliveryLat=v; }
    public double getDeliveryLng() { return deliveryLng; }
    public void setDeliveryLng(double v) { deliveryLng=v; }
    public double getStoreLat() { return storeLat; }
    public void setStoreLat(double v) { storeLat=v; }
    public double getStoreLng() { return storeLng; }
    public void setStoreLng(double v) { storeLng=v; }
    public String getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(String v) { estimatedDelivery=v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt=v; }
}
