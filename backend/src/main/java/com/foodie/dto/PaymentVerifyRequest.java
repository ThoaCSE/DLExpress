package com.foodie.dto;
public class PaymentVerifyRequest {
    private String orderId,razorpayPaymentId,razorpayOrderId,razorpaySignature;
    public String getOrderId(){return orderId;} public void setOrderId(String v){orderId=v;}
    public String getRazorpayPaymentId(){return razorpayPaymentId;} public void setRazorpayPaymentId(String v){razorpayPaymentId=v;}
    public String getRazorpayOrderId(){return razorpayOrderId;} public void setRazorpayOrderId(String v){razorpayOrderId=v;}
    public String getRazorpaySignature(){return razorpaySignature;} public void setRazorpaySignature(String v){razorpaySignature=v;}
}
