package nexora_backend.database.repository;

import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.UserType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, String> {

    Optional<AdminUser> findByEmailIgnoreCase(String email);

    Optional<AdminUser> findByContactNumber(String contactNumber);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByContactNumber(String contactNumber);

    boolean existsByContactNumberAndUsernameNot(String contactNumber, String username);

    List<AdminUser> findByUserType(UserType userType);

    List<AdminUser> findByDepartment_DeptId(Long deptId);

    boolean existsByUserType_NameIgnoreCase(String name);

    Optional<AdminUser> findByUsername(String username);

}
