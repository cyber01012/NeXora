package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "responder_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponderType {

    @Id
    private String id;   // 1, 2, etc.

    @Column(nullable = false)
    private String name; // PDMA, Fire Brigade
}