package nexora_backend.shared.config;

import nexora_backend.responder.entity.ResponderTask;
import nexora_backend.responder.repository.ResponderTaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemoDataInitializer {

    @Bean
    CommandLineRunner seedResponderTasks(ResponderTaskRepository taskRepository) {
        return args -> {
            if (taskRepository.count() > 0) {
                return;
            }
            taskRepository.save(ResponderTask.builder()
                    .forwardedComplaintId(1L)
                    .responderId("kelectric_fp")
                    .title("Power outage - Korangi")
                    .description("No electricity for 3 hours in sector 32")
                    .locationAddress("Korangi-2, Street 5")
                    .latitude(24.8267)
                    .longitude(67.1460)
                    .priority("HIGH")
                    .status("PENDING")
                    .build());
            taskRepository.save(ResponderTask.builder()
                    .forwardedComplaintId(2L)
                    .responderId("kelectric_fp")
                    .title("Broken transformer - Clifton")
                    .description("Transformer sparking near Block 5")
                    .locationAddress("Clifton Block 5")
                    .latitude(24.8138)
                    .longitude(67.0299)
                    .priority("CRITICAL")
                    .status("PENDING")
                    .build());
        };
    }
}
