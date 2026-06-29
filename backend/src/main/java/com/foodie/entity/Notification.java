package com.foodie.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id private String id;
    private String userId;
    private String title;
    private String message;
    private String type;
    private String referenceId;
    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Notification n = new Notification();
        public Builder userId(String v) { n.userId=v; return this; }
        public Builder title(String v) { n.title=v; return this; }
        public Builder message(String v) { n.message=v; return this; }
        public Builder type(String v) { n.type=v; return this; }
        public Builder referenceId(String v) { n.referenceId=v; return this; }
        public Notification build() { return n; }
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public void setUserId(String v) { userId=v; }
    public String getTitle() { return title; }
    public void setTitle(String v) { title=v; }
    public String getMessage() { return message; }
    public void setMessage(String v) { message=v; }
    public String getType() { return type; }
    public void setType(String v) { type=v; }
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String v) { referenceId=v; }
    public boolean isRead() { return read; }
    public void setRead(boolean v) { read=v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime v) { createdAt=v; }
}
