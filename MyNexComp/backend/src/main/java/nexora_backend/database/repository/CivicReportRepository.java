package nexora_backend.database.repository;

import nexora_backend.database.entity.CivicReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CivicReportRepository extends JpaRepository<CivicReport, Long> {

    List<CivicReport> findByCitizen_IdOrderByCivicIdDesc(Long citizenId);

    List<CivicReport> findByStatus(String status);

    List<CivicReport> findByStatusOrderByCivicIdDesc(String status);

    long countByStatus(String status);
}
