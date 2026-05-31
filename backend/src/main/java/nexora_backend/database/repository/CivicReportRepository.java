package nexora_backend.database.repository;

import nexora_backend.database.entity.CivicReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CivicReportRepository extends JpaRepository<CivicReport, Long> {
}
