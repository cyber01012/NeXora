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

/**
 * Ensures every responder type has at least one department so admin responder registration can resolve a dept.
 */
@Component
@Order(3)
@RequiredArgsConstructor
public class DepartmentResponderLinkSeeder implements ApplicationRunner {

    private final DepartmentRepository departmentRepository;
    private final ResponderTypeRepository responderTypeRepository;

    @Override
    public void run(ApplicationArguments args) {
        for (ResponderType type : responderTypeRepository.findAll()) {
            if (departmentRepository
                    .findFirstByResponderType_IdAndActiveTrueOrderByDeptNameAsc(type.getId())
                    .isPresent()) {
                continue;
            }
            String category = "S3".equals(type.getId()) ? "NGO" : "GOV";
            departmentRepository.save(
                    Department.builder()
                            .deptName(type.getName() + " Operations")
                            .responderTypeCategory(category)
                            .responderType(type)
                            .active(true)
                            .entryDate(LocalDate.now())
                            .entryTime(LocalTime.now())
                            .build()
            );
        }
    }
}
