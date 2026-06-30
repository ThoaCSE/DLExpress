package prog.ex.api.controller;

import prog.ex.api.entity.UserEntity;
import prog.ex.api.io.UserRequest;
import prog.ex.api.io.UserResponse;
import prog.ex.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Giúp React thoải mái gọi sang mà không bị chặn CORS
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // 🌟 1. API ĐĂNG KÝ (Sign Up / Register)
    @PostMapping("/foods/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> register(@RequestBody UserRequest request) {
        // Kiểm tra xem email này đã được ai đăng ký trước đó chưa
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email này đã tồn tại trong hệ thống rồi!");
        }

        // Chuyển dữ liệu từ Request sang Entity để lưu vào database ảo
        UserEntity newUser = new UserEntity();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword()); // Lưu mật khẩu

        userRepository.save(newUser); // Lưu xuống RAM thành công!

        // Trả về kết quả đẹp đẽ cho React giống mẫu của thầy
        UserResponse response = new UserResponse(newUser.getName(), newUser.getEmail());
        return ResponseEntity.ok(response);
    }

    // 🌟 2. API ĐĂNG NHẬP (Sign In / Login)
    @PostMapping("/foods/login")
    public ResponseEntity<?> login(@RequestBody UserRequest request) {
        Optional<UserEntity> userOpt = userRepository.findByEmail(request.getEmail());

        // Đối chiếu email và mật khẩu xem có khớp trong database ảo không
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(request.getPassword())) {
            UserResponse response = new UserResponse(userOpt.get().getName(), userOpt.get().getEmail());
            return ResponseEntity.ok(response); // Đăng nhập thành công
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Error: Sai tài khoản hoặc mật khẩu rồi em bé ơi!");
    }
}