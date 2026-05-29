package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "worker_report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerWorkerReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;  // ✅ TransactionID / progressID

    // ✅ FK → Forwarded Complaint
    @ManyToOne
    @JoinColumn(name = "forwarded_complain_id")
    private ForwardedComplaint forwardedComplaint;

    // ✅ FK → Worker
    @ManyToOne
    @JoinColumn(name = "username_created", referencedColumnName = "usernameCreated")
    private VolunteerWorkerCreator worker;

    private LocalDate reportDate;

    private LocalTime reportTime;

    private String progressText; // ✅ updates
}
