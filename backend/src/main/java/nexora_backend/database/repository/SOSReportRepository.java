package nexora_backend.database.repository;

import nexora_backend.database.entity.SOSReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SOSReportRepository extends JpaRepository<SOSReport, Long> {
}
