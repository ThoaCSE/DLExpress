package com.foodie.repository;
import com.foodie.entity.User;
import com.foodie.entity.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;
public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findByEmail(String email);
    List<User> findByDeletionRequestedTrue();
    List<User> findByActiveTrue();
    List<User> findByRole(UserRole role);
}
