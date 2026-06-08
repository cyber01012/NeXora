//package nexora_backend;  // ← Ye check karo
//
//import org.springframework.boot.SpringApplication;
//import org.springframework.boot.autoconfigure.SpringBootApplication;
//
//@SpringBootApplication
//public class NexoraBackendApplication {
//	public static void main(String[] args) {
//		SpringApplication.run(NexoraBackendApplication.class, args);
//	}
//}

package nexora_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"nexora_backend"})  // ✅ ADD THIS
public class NexoraBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(NexoraBackendApplication.class, args);
	}
}