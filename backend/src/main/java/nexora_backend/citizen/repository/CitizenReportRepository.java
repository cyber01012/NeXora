//package nexora_backend.citizen.repository;
//
//import nexora_backend.citizen.entity.CitizenReport;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//
//@Repository
//public interface CitizenReportRepository extends JpaRepository<CitizenReport, Long> {
//    List<CitizenReport> findByCitizenIdOrderByCreatedAtDesc(Long citizenId);
//}