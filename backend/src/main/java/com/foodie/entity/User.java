package com.foodie.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id private String id;
    private String fullName;
    @Indexed(unique = true) private String email;
    private String password;
    private String phone;
    private String address;
    private UserRole role = UserRole.BUYER;
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastLogin;
    // v5.2: deletion request
    private boolean deletionRequested = false;
    private String deletionReason;
    private LocalDateTime deletionRequestedAt;
    private String deletionStatus; // PENDING, APPROVED, REJECTED
    private String deletionReviewNote;

    // getters/setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { fullName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { email = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { password = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { phone = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { address = v; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole v) { role = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { active = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt = v; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime v) { lastLogin = v; }
    public boolean isDeletionRequested() { return deletionRequested; }
    public void setDeletionRequested(boolean v) { deletionRequested = v; }
    public String getDeletionReason() { return deletionReason; }
    public void setDeletionReason(String v) { deletionReason = v; }
    public LocalDateTime getDeletionRequestedAt() { return deletionRequestedAt; }
    public void setDeletionRequestedAt(LocalDateTime v) { deletionRequestedAt = v; }
    public String getDeletionStatus() { return deletionStatus; }
    public void setDeletionStatus(String v) { deletionStatus = v; }
    public String getDeletionReviewNote() { return deletionReviewNote; }
    public void setDeletionReviewNote(String v) { deletionReviewNote = v; }
}
