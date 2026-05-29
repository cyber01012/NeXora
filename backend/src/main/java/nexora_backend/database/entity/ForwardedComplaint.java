package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;
import nexora_backend.database.enums.Decision;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "forwarded_complaint")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForwardedComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long forwardedComplainId;

    // ✅ Assigning Officer (AdminUser username PK)
    @ManyToOne
    @JoinColumn(name = "assigning_officer_id", referencedColumnName = "username")
    private AdminUser assigningOfficer;

    // ✅ Username of dept-side person (also AdminUser)
    @ManyToOne
    @JoinColumn(name = "dept_username", referencedColumnName = "username")
    private AdminUser deptUser;

    // ✅ FK → Citizen (via phone_num)
    @ManyToOne
    @JoinColumn(name = "citizen_id")  // ✅ use PK
    private RegisterCitizen citizen;

    // ✅ FK → Anonymous
    @ManyToOne
    @JoinColumn(name = "anonymous_id")
    private AnonymousReport anonymousReport;

    // ✅ Civic Report ID (optional)
    private Long reportId;

    // ✅ SOS ID (optional)
    private Long sosId;

    // ✅ FK → Department
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    // ✅ Submitted by assigning officer
    private Boolean submitStatus;

    private LocalDate submitDate;
    private LocalTime submitTime;

    // ✅ Read by department
    private Boolean readByDept;

    private LocalDate readByDeptDate;
    private LocalTime readByDeptTime;

    // ✅ Assigned to Worker/Volunteer
    private Boolean assignedToWorker;

    private LocalDate assignedWorkerDate;
    private LocalTime assignedWorkerTime;

    // ✅ FK → Worker
    @ManyToOne
    @JoinColumn(name = "worker_username", referencedColumnName = "usernameCreated")
    private VolunteerWorkerCreator worker;

    // ✅ Dept decision
    @Enumerated(EnumType.STRING)
    private Decision deptDecision; // D / R

    // ✅ Worker read
    private Boolean readByWorker;

    private LocalDate readWorkerDate;
    private LocalTime readWorkerTime;

    // ✅ Worker accepted task
    private Boolean acceptedByWorker;

    private LocalDate acceptedDate;
    private LocalTime acceptedTime;

    // ✅ Worker final decision
    @Enumerated(EnumType.STRING)
    private Decision workerDecision; // D / R

    // ✅ Remarks
    private String remarks;
}
