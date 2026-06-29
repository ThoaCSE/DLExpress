package com.foodie.dto;
import com.foodie.entity.UserRole;
public class AuthResponse {
    private String token,userId,fullName,email; private UserRole role;
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final AuthResponse r=new AuthResponse();
        public Builder token(String v){r.token=v;return this;}
        public Builder userId(String v){r.userId=v;return this;}
        public Builder fullName(String v){r.fullName=v;return this;}
        public Builder email(String v){r.email=v;return this;}
        public Builder role(UserRole v){r.role=v;return this;}
        public AuthResponse build(){return r;}
    }
    public String getToken(){return token;} public void setToken(String v){token=v;}
    public String getUserId(){return userId;} public void setUserId(String v){userId=v;}
    public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public UserRole getRole(){return role;} public void setRole(UserRole v){role=v;}
}
