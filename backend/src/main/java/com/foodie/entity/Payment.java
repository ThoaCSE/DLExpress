package com.foodie.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "payments")
public class Payment {
    @Id private String id;
    private String orderId;
    private String buyerId;
    private double amount;
    // v6: CASH, CARD, QR
    private String method; // CASH | CARD | QR
    private String status; // PENDING | SUCCESS | FAILED
    private String transactionRef;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Payment p = new Payment();
        public Builder orderId(String v) { p.orderId=v; return this; }
        public Builder buyerId(String v) { p.buyerId=v; return this; }
        public Builder amount(double v) { p.amount=v; return this; }
        public Builder method(String v) { p.method=v; return this; }
        public Builder status(String v) { p.status=v; return this; }
        public Builder transactionRef(String v) { p.transactionRef=v; return this; }
        public Payment build() { return p; }
    }

    public String getId() { return id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String v) { orderId=v; }
    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String v) { buyerId=v; }
    public double getAmount() { return amount; }
    public void setAmount(double v) { amount=v; }
    public String getMethod() { return method; }
    public void setMethod(String v) { method=v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { status=v; }
    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String v) { transactionRef=v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt=v; }
    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime v) { paidAt=v; }
}
