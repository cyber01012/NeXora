package nexora_backend.shared.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDatabase() {
        return args -> {
            // ✅ DataSeeder DISABLED - Using manual SQL inserts instead
            System.out.println("⚠️ DataSeeder is DISABLED. Using manual SQL data.");
            System.out.println("💡 Data already inserted via pgAdmin SQL script.");
        };
    }
}