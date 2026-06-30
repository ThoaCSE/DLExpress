package prog.ex.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // Nhãn này báo cho IntelliJ biết đây là dự án Spring Boot
public class Application {

	public static void main(String[] args) {
		// Hàm main thần thánh kích hoạt toàn bộ server backend chạy lên
		SpringApplication.run(Application.class, args);
	}
}