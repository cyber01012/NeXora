package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;
import nexora_backend.database.enums.Decision;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "forward_decision")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForwardDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ FK → ForwardedComplaint
    @OneToOne
    @JoinColumn(name = "forwarded_complain_id")
    private ForwardedComplaint forwardedComplaint;

    @Enumerated(EnumType.STRING)
    private Decision decisionType;  // ✅ ADD THIS

    private String evidence;   // ✅ pics link (required for D)

    private String description; // ✅ required for R

    private LocalDate date;

    private LocalTime time;
}
