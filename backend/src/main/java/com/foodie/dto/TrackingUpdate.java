package com.foodie.dto;
public class TrackingUpdate {
    private String orderId,status,estimatedDelivery,driverName;
    private double lat,lng;
    public String getOrderId(){return orderId;} public void setOrderId(String v){orderId=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getEstimatedDelivery(){return estimatedDelivery;} public void setEstimatedDelivery(String v){estimatedDelivery=v;}
    public String getDriverName(){return driverName;} public void setDriverName(String v){driverName=v;}
    public double getLat(){return lat;} public void setLat(double v){lat=v;}
    public double getLng(){return lng;} public void setLng(double v){lng=v;}
}
