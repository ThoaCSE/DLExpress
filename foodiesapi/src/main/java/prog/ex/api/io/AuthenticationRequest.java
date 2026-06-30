package prog.ex.api.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Lombok tự động sinh ngầm: Getter, Setter, toString, equals, và hashCode
@Data
// Lombok tự động sinh ngầm: Constructor có đầy đủ tham số (email, password)
@AllArgsConstructor
// Lombok tự động sinh ngầm: Constructor rỗng không có tham số
@NoArgsConstructor
public class AuthenticationRequest {

    private String email;
    private String password;

}