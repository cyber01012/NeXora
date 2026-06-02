package nexora_backend.database.repository;

import nexora_backend.database.entity.VolunteerWorkerCreator;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VolunteerWorkerCreatorRepository extends JpaRepository<VolunteerWorkerCreator, String> {

    Optional<VolunteerWorkerCreator> findByEmailIgnoreCase(String email);

    Optional<VolunteerWorkerCreator> findByPhoneNumber(String phoneNumber);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumberAndUsernameCreatedNot(String phoneNumber, String usernameCreated);

    List<VolunteerWorkerCreator> findByDepartment_DeptId(Long deptId);
}
