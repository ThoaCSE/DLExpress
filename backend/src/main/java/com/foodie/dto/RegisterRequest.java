package com.foodie.dto;
import com.foodie.entity.UserRole;
public class RegisterRequest {
    private String fullName,email,password,phone,address;
    private UserRole role=UserRole.BUYER;
    public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getPassword(){return password;} public void setPassword(String v){password=v;}
    public String getPhone(){return phone;} public void setPhone(String v){phone=v;}
    public String getAddress(){return address;} public void setAddress(String v){address=v;}
    public UserRole getRole(){return role;} public void setRole(UserRole v){role=v;}
}
