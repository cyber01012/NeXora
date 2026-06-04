package nexora_backend.database.repository;

import nexora_backend.database.entity.VolunteerWorkerCreator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerWorkerCreatorRepository extends JpaRepository<VolunteerWorkerCreator, String> {

    // ✅ ADD THESE METHODS

    Optional<VolunteerWorkerCreator> findByUsernameCreated(String usernameCreated);

    List<VolunteerWorkerCreator> findByDepartmentDeptId(Long deptId);

    List<VolunteerWorkerCreator> findByDepartmentDeptIdAndActiveTrue(Long deptId);

    boolean existsByUsernameCreated(String usernameCreated);

    List<VolunteerWorkerCreator> findByActiveTrue();

    List<VolunteerWorkerCreator> findByDepartment_DeptIdAndActiveTrue(Long deptId);
}