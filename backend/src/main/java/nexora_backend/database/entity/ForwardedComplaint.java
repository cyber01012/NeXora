//package nexora_backend.database.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import nexora_backend.database.enums.Decision;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//
//@Entity
//@Table(name = "forwarded_complaint")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ForwardedComplaint {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long forwardedComplainId;
//
//    // ✅ Assigning Officer (AdminUser username PK)
//    @ManyToOne
//    @JoinColumn(name = "assigning_officer_id", referencedColumnName = "username")
//    private AdminUser assigningOfficer;
//
//    // ✅ Username of dept-side person (also AdminUser)
//    @ManyToOne
//    @JoinColumn(name = "dept_username", referencedColumnName = "username")
//    private AdminUser deptUser;
//
//    // ✅ FK → Citizen (via phone_num)
//    @ManyToOne
//    @JoinColumn(name = "citizen_id")  // ✅ use PK
//    private RegisterCitizen citizen;
//
//    // ✅ FK → Anonymous
//    @ManyToOne
//    @JoinColumn(name = "anonymous_id")
//    private AnonymousReport anonymousReport;
//
//    // ✅ Civic Report ID (optional)
//    private Long reportId;
//
//    // ✅ SOS ID (optional)
//    private Long sosId;
//
//    // ✅ FK → Department
//    @ManyToOne
//    @JoinColumn(name = "dept_id")
//    private Department department;
//
//    // ✅ Submitted by assigning officer
//    private Boolean submitStatus;
//
//    private LocalDate submitDate;
//    private LocalTime submitTime;
//
//    // ✅ Read by department
//    private Boolean readByDept;
//
//    private LocalDate readByDeptDate;
//    private LocalTime readByDeptTime;
//
//    // ✅ Assigned to Worker/Volunteer
//    private Boolean assignedToWorker;
//
//    private LocalDate assignedWorkerDate;
//    private LocalTime assignedWorkerTime;
//
//    // ✅ FK → Worker
//    @ManyToOne
//    @JoinColumn(name = "worker_username", referencedColumnName = "usernameCreated")
//    private VolunteerWorkerCreator worker;
//
//    // ✅ Dept decision
//    @Enumerated(EnumType.STRING)
//    private Decision deptDecision; // D / R
//
//    // ✅ Worker read
//    private Boolean readByWorker;
//
//    private LocalDate readWorkerDate;
//    private LocalTime readWorkerTime;
//
//    // ✅ Worker accepted task
//    private Boolean acceptedByWorker;
//
//    private LocalDate acceptedDate;
//    private LocalTime acceptedTime;
//
//    // ✅ Worker final decision
//    @Enumerated(EnumType.STRING)
//    private Decision workerDecision; // D / R
//
//    // ✅ Remarks
//    private String remarks;
//}

package nexora_backend.database.entity;

import jakarta.persistence.*;
import nexora_backend.database.enums.Decision;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "forwarded_complaint")
public class ForwardedComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long forwardedComplainId;

    // Assigning Officer (AdminUser username PK)
    @ManyToOne
    @JoinColumn(name = "assigning_officer_id", referencedColumnName = "username")
    private AdminUser assigningOfficer;

    // Username of dept-side person (also AdminUser)
    @ManyToOne
    @JoinColumn(name = "dept_username", referencedColumnName = "username")
    private AdminUser deptUser;

    // FK → Citizen
    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private RegisterCitizen citizen;

    // FK → Anonymous
    @ManyToOne
    @JoinColumn(name = "anonymous_id")
    private AnonymousReport anonymousReport;

    private Long reportId;
    private Long sosId;

    // FK → Department
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    // Submitted by assigning officer
    private Boolean submitStatus;
    private LocalDate submitDate;
    private LocalTime submitTime;

    // Read by department
    private Boolean readByDept;
    private LocalDate readByDeptDate;
    private LocalTime readByDeptTime;

    // Assigned to Worker/Volunteer
    private Boolean assignedToWorker;
    private LocalDate assignedWorkerDate;
    private LocalTime assignedWorkerTime;

    // FK → Worker (VolunteerWorkerCreator)
    @ManyToOne
    @JoinColumn(name = "worker_username", referencedColumnName = "usernameCreated")
    private VolunteerWorkerCreator worker;

    // Dept decision (D / R)
    @Enumerated(EnumType.STRING)
    private Decision deptDecision;

    // Worker read
    private Boolean readByWorker;
    private LocalDate readWorkerDate;
    private LocalTime readWorkerTime;

    // Worker accepted task
    private Boolean acceptedByWorker;
    private LocalDate acceptedDate;
    private LocalTime acceptedTime;

    // Worker final decision (D / R)
    @Enumerated(EnumType.STRING)
    private Decision workerDecision;

    // Remarks
    private String remarks;

    // ========== CONSTRUCTORS ==========
    public ForwardedComplaint() {}

    // ========== GETTERS & SETTERS ==========
    public Long getForwardedComplainId() { return forwardedComplainId; }
    public void setForwardedComplainId(Long forwardedComplainId) { this.forwardedComplainId = forwardedComplainId; }

    public AdminUser getAssigningOfficer() { return assigningOfficer; }
    public void setAssigningOfficer(AdminUser assigningOfficer) { this.assigningOfficer = assigningOfficer; }

    public AdminUser getDeptUser() { return deptUser; }
    public void setDeptUser(AdminUser deptUser) { this.deptUser = deptUser; }

    public RegisterCitizen getCitizen() { return citizen; }
    public void setCitizen(RegisterCitizen citizen) { this.citizen = citizen; }

    public AnonymousReport getAnonymousReport() { return anonymousReport; }
    public void setAnonymousReport(AnonymousReport anonymousReport) { this.anonymousReport = anonymousReport; }

    public Long getReportId() { return reportId; }
    public void setReportId(Long reportId) { this.reportId = reportId; }

    public Long getSosId() { return sosId; }
    public void setSosId(Long sosId) { this.sosId = sosId; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Boolean getSubmitStatus() { return submitStatus; }
    public void setSubmitStatus(Boolean submitStatus) { this.submitStatus = submitStatus; }

    public LocalDate getSubmitDate() { return submitDate; }
    public void setSubmitDate(LocalDate submitDate) { this.submitDate = submitDate; }

    public LocalTime getSubmitTime() { return submitTime; }
    public void setSubmitTime(LocalTime submitTime) { this.submitTime = submitTime; }

    public Boolean getReadByDept() { return readByDept; }
    public void setReadByDept(Boolean readByDept) { this.readByDept = readByDept; }

    public LocalDate getReadByDeptDate() { return readByDeptDate; }
    public void setReadByDeptDate(LocalDate readByDeptDate) { this.readByDeptDate = readByDeptDate; }

    public LocalTime getReadByDeptTime() { return readByDeptTime; }
    public void setReadByDeptTime(LocalTime readByDeptTime) { this.readByDeptTime = readByDeptTime; }

    public Boolean getAssignedToWorker() { return assignedToWorker; }
    public void setAssignedToWorker(Boolean assignedToWorker) { this.assignedToWorker = assignedToWorker; }

    public LocalDate getAssignedWorkerDate() { return assignedWorkerDate; }
    public void setAssignedWorkerDate(LocalDate assignedWorkerDate) { this.assignedWorkerDate = assignedWorkerDate; }

    public LocalTime getAssignedWorkerTime() { return assignedWorkerTime; }
    public void setAssignedWorkerTime(LocalTime assignedWorkerTime) { this.assignedWorkerTime = assignedWorkerTime; }

    public VolunteerWorkerCreator getWorker() { return worker; }
    public void setWorker(VolunteerWorkerCreator worker) { this.worker = worker; }

    public Decision getDeptDecision() { return deptDecision; }
    public void setDeptDecision(Decision deptDecision) { this.deptDecision = deptDecision; }

    public Boolean getReadByWorker() { return readByWorker; }
    public void setReadByWorker(Boolean readByWorker) { this.readByWorker = readByWorker; }

    public LocalDate getReadWorkerDate() { return readWorkerDate; }
    public void setReadWorkerDate(LocalDate readWorkerDate) { this.readWorkerDate = readWorkerDate; }

    public LocalTime getReadWorkerTime() { return readWorkerTime; }
    public void setReadWorkerTime(LocalTime readWorkerTime) { this.readWorkerTime = readWorkerTime; }

    public Boolean getAcceptedByWorker() { return acceptedByWorker; }
    public void setAcceptedByWorker(Boolean acceptedByWorker) { this.acceptedByWorker = acceptedByWorker; }

    public LocalDate getAcceptedDate() { return acceptedDate; }
    public void setAcceptedDate(LocalDate acceptedDate) { this.acceptedDate = acceptedDate; }

    public LocalTime getAcceptedTime() { return acceptedTime; }
    public void setAcceptedTime(LocalTime acceptedTime) { this.acceptedTime = acceptedTime; }

    public Decision getWorkerDecision() { return workerDecision; }
    public void setWorkerDecision(Decision workerDecision) { this.workerDecision = workerDecision; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}