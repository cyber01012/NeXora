package nexora_backend.citizen.entity; //// ============================================
//// FILE: nexora_backend/independent/entity/CitizenSavedLocation.java
//// ============================================
//package nexora_backend.independent.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "citizen_saved_location")
//public class CitizenSavedLocation {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "citizen_id", nullable = false)
//    private Long citizenId;
//
//    @Column(nullable = false, length = 50)
//    private String label;
//
//    @Column(nullable = false, columnDefinition = "TEXT")
//    private String address;
//
//    private Double latitude;
//    private Double longitude;
//
//    @Column(name = "is_default")
//    private Boolean isDefault = false;
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    protected void onCreate() {
//        createdAt = LocalDateTime.now();
//    }
//
//    // ========== GETTERS ==========
//    public Long getId() { return id; }
//    public Long getCitizenId() { return citizenId; }
//    public String getLabel() { return label; }
//    public String getAddress() { return address; }
//    public Double getLatitude() { return latitude; }
//    public Double getLongitude() { return longitude; }
//    public Boolean getIsDefault() { return isDefault; }
//    public LocalDateTime getCreatedAt() { return createdAt; }
//
//    // ========== SETTERS ==========
//    public void setId(Long id) { this.id = id; }
//    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }
//    public void setLabel(String label) { this.label = label; }
//    public void setAddress(String address) { this.address = address; }
//    public void setLatitude(Double latitude) { this.latitude = latitude; }
//    public void setLongitude(Double longitude) { this.longitude = longitude; }
//    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//}