package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "department")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deptId;

    private String deptName;

    // ✅ NGO or GOV
    private String responderTypeCategory; // "NGO" or "GOV"

    private String focalPersonName;

    private String focalPersonNumber;

    private String deptAddress;

    private String deptEmail;

    private String entryPerson;

    private LocalDate entryDate;

    private LocalTime entryTime;

    private Boolean active;

    // ✅ FK to ResponderType
    @ManyToOne
    @JoinColumn(name = "responder_type_id")
    private ResponderType responderType;
}