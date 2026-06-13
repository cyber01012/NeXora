package nexora_backend.database.repository;

import nexora_backend.database.entity.ComplaintNature;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintNatureRepository
        extends JpaRepository<ComplaintNature, Long> {

    List<ComplaintNature>
    findByType_Id(Integer id);
}