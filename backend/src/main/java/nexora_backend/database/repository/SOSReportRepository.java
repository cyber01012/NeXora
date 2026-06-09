package nexora_backend.database.repository;

import nexora_backend.database.entity.SOSReport;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SOSReportRepository
        extends JpaRepository<SOSReport, Long> {

    long countByStatus(String status);

    List<SOSReport>
    findTop10ByOrderBySosIdDesc();
}