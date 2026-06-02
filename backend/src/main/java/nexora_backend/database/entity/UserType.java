package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_type")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserType {

    @Id
    private Integer id;

    // help desk, assigning officer, admin, responder, ngo
    @Column(nullable = false)
    private String name;
}