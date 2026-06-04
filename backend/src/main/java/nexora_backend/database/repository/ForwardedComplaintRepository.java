package nexora_backend.database.repository;

import nexora_backend.database.entity.ForwardedComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ForwardedComplaintRepository extends JpaRepository<ForwardedComplaint, Long> {

    List<ForwardedComplaint> findByDepartment_DeptIdOrderBySubmitDateDesc(Long deptId);

    // ✅ ADD THIS METHOD
    List<ForwardedComplaint> findByDepartment_DeptId(Long deptId);
}