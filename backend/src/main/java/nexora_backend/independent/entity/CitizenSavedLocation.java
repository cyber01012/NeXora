//package nexora_backend.independent.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "citizen_saved_location")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class CitizenSavedLocation {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "citizen_id")
//    private Long citizenId;
//
//    private String label;
//    private String address;
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
//}