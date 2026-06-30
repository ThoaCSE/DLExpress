package com.foodie.repository;
import com.foodie.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
public interface OrderRepository extends MongoRepository<Order,String> {
    List<Order> findByBuyerIdOrderByCreatedAtDesc(String buyerId);
    List<Order> findByStoreIdOrderByCreatedAtDesc(String storeId);
    List<Order> findAllByOrderByCreatedAtDesc();
    List<Order> findByStoreIdIn(List<String> storeIds);
    List<Order> findByBuyerIdAndPaymentStatus(String buyerId, String paymentStatus);
    void deleteByBuyerId(String buyerId);
    void deleteByStoreIdIn(List<String> storeIds);
}
