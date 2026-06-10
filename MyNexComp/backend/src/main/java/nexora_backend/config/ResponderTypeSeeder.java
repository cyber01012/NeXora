package nexora_backend.config;

import lombok.RequiredArgsConstructor;
import nexora_backend.database.entity.ResponderType;
import nexora_backend.database.repository.ResponderTypeRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(1)
@RequiredArgsConstructor
public class ResponderTypeSeeder implements ApplicationRunner {

    private static final List<ResponderType> DEFAULT_TYPES = List.of(
            ResponderType.builder().id("P1").name("PDMA").build(),
            ResponderType.builder().id("F2").name("Fire Brigade").build(),
            ResponderType.builder().id("S3").name("Search & Rescue Team").build(),
            ResponderType.builder().id("S4").name("SUI Gas").build(),
            ResponderType.builder().id("K5").name("K-Electric").build(),
            ResponderType.builder().id("K6").name("KMC (Sewerage)").build(),
            ResponderType.builder().id("D7").name("Disaster Relief Unit").build(),
            ResponderType.builder().id("P8").name("PDMA").build()
    );

    private final ResponderTypeRepository responderTypeRepository;

    @Override
    public void run(ApplicationArguments args) {
        for (ResponderType type : DEFAULT_TYPES) {
            if (!responderTypeRepository.existsById(type.getId())) {
                responderTypeRepository.save(type);
            }
        }
    }
}
