package com.foodie.repository;
import com.foodie.entity.Store;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
public interface StoreRepository extends MongoRepository<Store,String> {
    List<Store> findByApproved(boolean approved);
    Optional<Store> findByOwnerId(String ownerId);
    List<Store> findAllByOwnerId(String ownerId);
}
