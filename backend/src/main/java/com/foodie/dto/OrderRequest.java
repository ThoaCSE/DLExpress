package com.foodie.dto;
import com.foodie.entity.CartItem;
import java.util.List;
public class OrderRequest {
    private String storeId,deliveryAddress,paymentMethod;
    private List<CartItem> items;
    private double totalAmount,deliveryLat,deliveryLng;
    public String getStoreId(){return storeId;} public void setStoreId(String v){storeId=v;}
    public String getDeliveryAddress(){return deliveryAddress;} public void setDeliveryAddress(String v){deliveryAddress=v;}
    public String getPaymentMethod(){return paymentMethod;} public void setPaymentMethod(String v){paymentMethod=v;}
    public List<CartItem> getItems(){return items;} public void setItems(List<CartItem> v){items=v;}
    public double getTotalAmount(){return totalAmount;} public void setTotalAmount(double v){totalAmount=v;}
    public double getDeliveryLat(){return deliveryLat;} public void setDeliveryLat(double v){deliveryLat=v;}
    public double getDeliveryLng(){return deliveryLng;} public void setDeliveryLng(double v){deliveryLng=v;}
}
