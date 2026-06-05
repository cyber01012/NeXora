package nexora_backend.database.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "volunteer_worker")
public class VolunteerWorkerCreator {

    @Id
    private String usernameCreated;

    private String name;
    private String password;
    private Boolean active;
    private String phoneNumber;
    private String email;
    private String profilePic;
    private LocalDate createdDate;
    private LocalTime createdTime;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    // ========== CONSTRUCTORS ==========
    public VolunteerWorkerCreator() {}

    public VolunteerWorkerCreator(String usernameCreated, String name, String password,
                                  Boolean active, String phoneNumber, String email,
                                  String profilePic, LocalDate createdDate,
                                  LocalTime createdTime, Department department) {
        this.usernameCreated = usernameCreated;
        this.name = name;
        this.password = password;
        this.active = active;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.profilePic = profilePic;
        this.createdDate = createdDate;
        this.createdTime = createdTime;
        this.department = department;
    }

    // ========== GETTERS ==========
    public String getUsernameCreated() { return usernameCreated; }

    // ✅ ADD THIS METHOD
    public String getName() { return name; }

    public String getPassword() { return password; }
    public Boolean getActive() { return active; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getEmail() { return email; }
    public String getProfilePic() { return profilePic; }
    public LocalDate getCreatedDate() { return createdDate; }
    public LocalTime getCreatedTime() { return createdTime; }
    public Department getDepartment() { return department; }

    // ========== SETTERS ==========
    public void setUsernameCreated(String usernameCreated) { this.usernameCreated = usernameCreated; }
    public void setName(String name) { this.name = name; }
    public void setPassword(String password) { this.password = password; }
    public void setActive(Boolean active) { this.active = active; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setEmail(String email) { this.email = email; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }
    public void setCreatedDate(LocalDate createdDate) { this.createdDate = createdDate; }
    public void setCreatedTime(LocalTime createdTime) { this.createdTime = createdTime; }
    public void setDepartment(Department department) { this.department = department; }

    // ========== BUILDER ==========
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String usernameCreated;
        private String name;
        private String password;
        private Boolean active = true;
        private String phoneNumber;
        private String email;
        private String profilePic;
        private LocalDate createdDate;
        private LocalTime createdTime;
        private Department department;

        public Builder usernameCreated(String usernameCreated) { this.usernameCreated = usernameCreated; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder active(Boolean active) { this.active = active; return this; }
        public Builder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder profilePic(String profilePic) { this.profilePic = profilePic; return this; }
        public Builder createdDate(LocalDate createdDate) { this.createdDate = createdDate; return this; }
        public Builder createdTime(LocalTime createdTime) { this.createdTime = createdTime; return this; }
        public Builder department(Department department) { this.department = department; return this; }

        public VolunteerWorkerCreator build() {
            return new VolunteerWorkerCreator(usernameCreated, name, password, active,
                    phoneNumber, email, profilePic, createdDate,
                    createdTime, department);
        }
    }
}