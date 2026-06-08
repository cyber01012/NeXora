package nexora_backend.worker.dto.response;

/**
 * Response DTO for the Worker Profile endpoint.
 * Maps from VolunteerWorkerCreator entity fields.
 */
public class WorkerProfileResponse {

    private String username;
    private String name;
    private String email;
    private String phoneNumber;
    private Boolean active;
    private String department;
    private Long departmentId;
    private String deptAddress;
    private String memberSince;

    public WorkerProfileResponse() {}

    public String getUsername()     { return username; }
    public String getName()         { return name; }
    public String getEmail()        { return email; }
    public String getPhoneNumber()  { return phoneNumber; }
    public Boolean getActive()      { return active; }
    public String getDepartment()   { return department; }
    public Long getDepartmentId()   { return departmentId; }
    public String getDeptAddress()  { return deptAddress; }
    public String getMemberSince()  { return memberSince; }

    public void setUsername(String v)     { this.username = v; }
    public void setName(String v)         { this.name = v; }
    public void setEmail(String v)        { this.email = v; }
    public void setPhoneNumber(String v)  { this.phoneNumber = v; }
    public void setActive(Boolean v)      { this.active = v; }
    public void setDepartment(String v)   { this.department = v; }
    public void setDepartmentId(Long v)   { this.departmentId = v; }
    public void setDeptAddress(String v)  { this.deptAddress = v; }
    public void setMemberSince(String v)  { this.memberSince = v; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String username, name, email, phoneNumber, department, deptAddress, memberSince;
        private Boolean active;
        private Long departmentId;

        public Builder username(String v)     { this.username = v; return this; }
        public Builder name(String v)         { this.name = v; return this; }
        public Builder email(String v)        { this.email = v; return this; }
        public Builder phoneNumber(String v)  { this.phoneNumber = v; return this; }
        public Builder active(Boolean v)      { this.active = v; return this; }
        public Builder department(String v)   { this.department = v; return this; }
        public Builder departmentId(Long v)   { this.departmentId = v; return this; }
        public Builder deptAddress(String v)  { this.deptAddress = v; return this; }
        public Builder memberSince(String v)  { this.memberSince = v; return this; }

        public WorkerProfileResponse build() {
            WorkerProfileResponse r = new WorkerProfileResponse();
            r.username = username; r.name = name; r.email = email;
            r.phoneNumber = phoneNumber; r.active = active;
            r.department = department; r.departmentId = departmentId;
            r.deptAddress = deptAddress; r.memberSince = memberSince;
            return r;
        }
    }
}
