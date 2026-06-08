package nexora_backend.database.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deptId;

    private String deptName;
    private String responderTypeCategory;
    private String deptAddress;
    private String deptEmail;
    private String entryPerson;
    private LocalDate entryDate;
    private LocalTime entryTime;
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "responder_type_id")
    private ResponderType responderType;

    // ========== CONSTRUCTORS ==========
    public Department() {}

    // ========== GETTERS ==========
    public Long getDeptId() { return deptId; }
    public String getDeptName() { return deptName; }
    public String getResponderTypeCategory() { return responderTypeCategory; }
    public String getDeptAddress() { return deptAddress; }
    public String getDeptEmail() { return deptEmail; }
    public String getEntryPerson() { return entryPerson; }
    public LocalDate getEntryDate() { return entryDate; }
    public LocalTime getEntryTime() { return entryTime; }
    public Boolean getActive() { return active; }
    public ResponderType getResponderType() { return responderType; }

    // ========== SETTERS ==========
    public void setDeptId(Long deptId) { this.deptId = deptId; }
    public void setDeptName(String deptName) { this.deptName = deptName; }
    public void setResponderTypeCategory(String responderTypeCategory) { this.responderTypeCategory = responderTypeCategory; }
    public void setDeptAddress(String deptAddress) { this.deptAddress = deptAddress; }
    public void setDeptEmail(String deptEmail) { this.deptEmail = deptEmail; }
    public void setEntryPerson(String entryPerson) { this.entryPerson = entryPerson; }
    public void setEntryDate(LocalDate entryDate) { this.entryDate = entryDate; }
    public void setEntryTime(LocalTime entryTime) { this.entryTime = entryTime; }
    public void setActive(Boolean active) { this.active = active; }
    public void setResponderType(ResponderType responderType) { this.responderType = responderType; }

}