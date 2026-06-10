package nexora_backend.database.repository;

import nexora_backend.database.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    java.util.Optional<Department> findByDeptNameIgnoreCase(String deptName);

    java.util.Optional<Department> findFirstByResponderTypeCategoryIgnoreCaseAndActiveTrueOrderByDeptNameAsc(
            String responderTypeCategory
    );

    java.util.Optional<Department> findFirstByResponderType_IdAndActiveTrueOrderByDeptNameAsc(String responderTypeId);

    java.util.List<Department> findAllByOrderByDeptNameAsc();

    java.util.List<Department> findByActiveTrue();

    java.util.List<Department> findByActiveTrueOrderByDeptNameAsc();
}
