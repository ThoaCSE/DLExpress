package com.foodie.repository;
import com.foodie.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface NotificationRepository extends MongoRepository<Notification,String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    long countByUserIdAndRead(String userId, boolean read);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
