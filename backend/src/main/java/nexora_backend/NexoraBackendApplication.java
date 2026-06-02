package nexora_backend;  // ← Ye check karo

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
@EnableAsync
@SpringBootApplication
public class NexoraBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(NexoraBackendApplication.class, args);
	}
}