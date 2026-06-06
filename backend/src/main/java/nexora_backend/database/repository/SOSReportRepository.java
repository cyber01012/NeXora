package nexora_backend.database.repository;

import nexora_backend.database.entity.SOSReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SOSReportRepository extends JpaRepository<SOSReport, Long> {

    // Find all SOS reports by HelpDesk user
    List<SOSReport> findByHelpDeskUser_Username(String helpDeskUsername);

    // Find all SOS reports by status
    List<SOSReport> findByStatus(String status);

    // Find all pending SOS reports
    List<SOSReport> findByStatusOrderBySosIdDesc(String status);
}