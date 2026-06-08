package nexora_backend.database.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "admin_user")
public class AdminUser {

    @Id
    @Column(nullable = false, unique = true)
    private String username;

    @ManyToOne
    @JoinColumn(name = "user_type_id")
    private UserType userType;

    private String name;

    @Column(name = "contact_number", unique = true)
    private String contactNumber;

    private String email;
    private Boolean active;
    private String password;
    private LocalDate date;
    private LocalTime time;
    private String inactiveRemarks;
    private String category;

    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    // ========== CONSTRUCTORS ==========
    public AdminUser() {}

    public AdminUser(String username, UserType userType, String name, String contactNumber,
                     String email, Boolean active, String password, LocalDate date,
                     LocalTime time, String inactiveRemarks, String category, Department department) {
        this.username = username;
        this.userType = userType;
        this.name = name;
        this.contactNumber = contactNumber;
        this.email = email;
        this.active = active;
        this.password = password;
        this.date = date;
        this.time = time;
        this.inactiveRemarks = inactiveRemarks;
        this.category = category;
        this.department = department;
    }

    // ========== GETTERS ==========
    public String getUsername() { return username; }
    public UserType getUserType() { return userType; }
    public String getName() { return name; }
    public String getContactNumber() { return contactNumber; }
    public String getEmail() { return email; }
    public Boolean getActive() { return active; }
    public String getPassword() { return password; }
    public LocalDate getDate() { return date; }
    public LocalTime getTime() { return time; }
    public String getInactiveRemarks() { return inactiveRemarks; }
    public String getCategory() { return category; }
    public Department getDepartment() { return department; }

    // ========== SETTERS ==========
    public void setUsername(String username) { this.username = username; }
    public void setUserType(UserType userType) { this.userType = userType; }
    public void setName(String name) { this.name = name; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public void setEmail(String email) { this.email = email; }
    public void setActive(Boolean active) { this.active = active; }
    public void setPassword(String password) { this.password = password; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setTime(LocalTime time) { this.time = time; }
    public void setInactiveRemarks(String inactiveRemarks) { this.inactiveRemarks = inactiveRemarks; }
    public void setCategory(String category) { this.category = category; }
    public void setDepartment(Department department) { this.department = department; }

    // ========== BUILDER PATTERN ==========
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String username;
        private UserType userType;
        private String name;
        private String contactNumber;
        private String email;
        private Boolean active;
        private String password;
        private LocalDate date;
        private LocalTime time;
        private String inactiveRemarks;
        private String category;
        private Department department;

        public Builder username(String username) { this.username = username; return this; }
        public Builder userType(UserType userType) { this.userType = userType; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder active(Boolean active) { this.active = active; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder date(LocalDate date) { this.date = date; return this; }
        public Builder time(LocalTime time) { this.time = time; return this; }
        public Builder inactiveRemarks(String inactiveRemarks) { this.inactiveRemarks = inactiveRemarks; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder department(Department department) { this.department = department; return this; }

        public AdminUser build() {
            return new AdminUser(username, userType, name, contactNumber, email,
                    active, password, date, time, inactiveRemarks, category, department);
        }
    }
}