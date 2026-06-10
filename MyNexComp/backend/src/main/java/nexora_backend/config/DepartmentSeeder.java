package nexora_backend.config;

import lombok.RequiredArgsConstructor;
import nexora_backend.database.entity.Department;
import nexora_backend.database.entity.ResponderType;
import nexora_backend.database.repository.DepartmentRepository;
import nexora_backend.database.repository.ResponderTypeRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@Order(2)
@RequiredArgsConstructor
public class DepartmentSeeder implements ApplicationRunner {

    private final DepartmentRepository departmentRepository;
    private final ResponderTypeRepository responderTypeRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (departmentRepository.count() > 0) {
            return;
        }

        ResponderType pdma = responderTypeRepository.findById("P1").orElse(null);
        ResponderType fire = responderTypeRepository.findById("F2").orElse(null);
        ResponderType searchRescue = responderTypeRepository.findById("S3").orElse(null);

        List<Department> defaults = List.of(
                buildDepartment("PDMA Operations", "GOV", pdma),
                buildDepartment("Fire & Rescue Wing", "GOV", fire),
                buildDepartment("Search & Rescue Coordination", "NGO", searchRescue)
        );

        departmentRepository.saveAll(defaults);
    }

    private Department buildDepartment(String name, String category, ResponderType responderType) {
        return Department.builder()
                .deptName(name)
                .responderTypeCategory(category)
                .responderType(responderType)
                .active(true)
                .entryDate(LocalDate.now())
                .entryTime(LocalTime.now())
                .build();
    }
}
