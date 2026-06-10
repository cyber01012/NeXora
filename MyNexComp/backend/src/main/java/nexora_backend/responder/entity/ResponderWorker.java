package nexora_backend.responder.entity;//package nexora_backend.responder.entity;
//
//import jakarta.persistence.*;
//import nexora_backend.database.entity.Department;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "volunteer_worker")  // ← Using same table as volunteer
//public class ResponderWorker {
//
//    @Id
//    private String usernameCreated;
//
//    private String name;
//    private String password;
//    private Boolean active;
//    private String phoneNumber;
//    private String email;
//    private String profilePic;
//
//    @Column(name = "created_date")
//    private LocalDateTime createdDate;
//
//    @ManyToOne
//    @JoinColumn(name = "dept_id")
//    private Department department;
//
//    @PrePersist
//    protected void onCreate() {
//        createdDate = LocalDateTime.now();
//        if (active == null) active = true;
//    }
//
//    // Getters and Setters
//    public String getUsernameCreated() { return usernameCreated; }
//    public void setUsernameCreated(String usernameCreated) { this.usernameCreated = usernameCreated; }
//
//    public String getName() { return name; }
//    public void setName(String name) { this.name = name; }
//
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//
//    public Boolean getActive() { return active; }
//    public void setActive(Boolean active) { this.active = active; }
//
//    public String getPhoneNumber() { return phoneNumber; }
//    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getProfilePic() { return profilePic; }
//    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }
//
//    public LocalDateTime getCreatedDate() { return createdDate; }
//    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
//
//    public Department getDepartment() { return department; }
//    public void setDepartment(Department department) { this.department = department; }
//
//    // Builder
//    public static ResponderWorkerBuilder builder() { return new ResponderWorkerBuilder(); }
//
//    public static class ResponderWorkerBuilder {
//        private String usernameCreated;
//        private String name;
//        private String password;
//        private Boolean active = true;
//        private String phoneNumber;
//        private String email;
//        private String profilePic;
//        private LocalDateTime createdDate;
//        private Department department;
//
//        public ResponderWorkerBuilder usernameCreated(String usernameCreated) { this.usernameCreated = usernameCreated; return this; }
//        public ResponderWorkerBuilder name(String name) { this.name = name; return this; }
//        public ResponderWorkerBuilder password(String password) { this.password = password; return this; }
//        public ResponderWorkerBuilder active(Boolean active) { this.active = active; return this; }
//        public ResponderWorkerBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
//        public ResponderWorkerBuilder email(String email) { this.email = email; return this; }
//        public ResponderWorkerBuilder profilePic(String profilePic) { this.profilePic = profilePic; return this; }
//        public ResponderWorkerBuilder createdDate(LocalDateTime createdDate) { this.createdDate = createdDate; return this; }
//        public ResponderWorkerBuilder department(Department department) { this.department = department; return this; }
//
//        public ResponderWorker build() {
//            ResponderWorker worker = new ResponderWorker();
//            worker.usernameCreated = this.usernameCreated;
//            worker.name = this.name;
//            worker.password = this.password;
//            worker.active = this.active;
//            worker.phoneNumber = this.phoneNumber;
//            worker.email = this.email;
//            worker.profilePic = this.profilePic;
//            worker.createdDate = this.createdDate;
//            worker.department = this.department;
//            return worker;
//        }
//    }
//}