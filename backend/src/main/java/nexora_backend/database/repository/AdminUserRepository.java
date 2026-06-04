package nexora_backend.database.repository;

import nexora_backend.database.entity.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, String> {

    Optional<AdminUser> findByUsername(String username);

    boolean existsByUsername(String username);

    List<AdminUser> findByDepartmentDeptId(Long deptId);

    List<AdminUser> findByUserTypeId(Integer userTypeId);
}