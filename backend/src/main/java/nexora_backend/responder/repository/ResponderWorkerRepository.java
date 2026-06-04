//package nexora_backend.responder.repository;
//
//import nexora_backend.responder.entity.ResponderWorker;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface ResponderWorkerRepository extends JpaRepository<ResponderWorker, String> {
//
//    List<ResponderWorker> findByDepartmentDeptIdOrderByCreatedDateDesc(Long deptId);
//
//    Optional<ResponderWorker> findByUsernameCreated(String usernameCreated);
//
//    boolean existsByUsernameCreated(String usernameCreated);
//
//    List<ResponderWorker> findByDepartmentDeptIdAndActiveTrue(Long deptId);
//
//    List<ResponderWorker> findByActiveTrue();
//}