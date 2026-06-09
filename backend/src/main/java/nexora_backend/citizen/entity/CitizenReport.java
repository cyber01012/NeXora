package nexora_backend.citizen.entity;//package nexora_backend.citizen.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "civic_report")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class CitizenReport {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long civicId;
//
//    @Column(name = "citizen_id")
//    private Long citizenId;
//
//    private String detail;
//
//    @Column(name = "type_id")
//    private Integer typeId = 2;
//
//    @Column(name = "nature_id")
//    private Integer natureId;
//
//    private String province;
//    private String district;
//    private String town;
//    private String area;
//    private String city;
//    private String evidence;
//
//    private String status = "PENDING_ADMIN";
//    private String priority = "MEDIUM";
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//        if (typeId == null) typeId = 2;
//        if (status == null) status = "PENDING_ADMIN";
//        if (priority == null) priority = "MEDIUM";
//    }
//
//    // ✅ ADD THIS METHOD for TaskService compatibility
//    public Long getId() {
//        return civicId;
//    }
//
//    // ✅ ADD THIS METHOD for TaskService compatibility
//    public void setId(Long id) {
//        this.civicId = id;
//    }
//
//    public Integer getNatureId() { return natureId; }
//    public void setNatureId(Integer natureId) { this.natureId = natureId; }
//    public String getArea() { return area; }
//    public void setArea(String area) { this.area = area; }
//    public String getCity() { return city; }
//    public void setCity(String city) { this.city = city; }
//    public String getDetail() { return detail; }
//    public void setDetail(String detail) { this.detail = detail; }
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//    public Long getCivicId() { return civicId; }
//    public void setCivicId(Long civicId) { this.civicId = civicId; }
//}