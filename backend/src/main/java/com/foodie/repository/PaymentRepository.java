package com.foodie.repository;
import com.foodie.entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
public interface PaymentRepository extends MongoRepository<Payment,String> {
    Optional<Payment> findByOrderId(String orderId);
    List<Payment> findByBuyerId(String buyerId);
    List<Payment> findAllByOrderByCreatedAtDesc();
}
