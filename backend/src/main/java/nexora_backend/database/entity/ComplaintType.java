package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "complaint_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintType {

    @Id
    private Integer id;   // 1 = SOS, 2 = CIVIC

    private String name;
}