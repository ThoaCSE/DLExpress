package prog.ex.api.repository;

import prog.ex.api.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    // Hàm dùng để tìm kiếm tài khoản bằng Email khi người dùng Sign In
    Optional<UserEntity> findByEmail(String email);
}