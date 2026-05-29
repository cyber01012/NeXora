package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_nature")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintNature {

    @Id
    private Integer id;

    private String description;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ComplaintType type;
}