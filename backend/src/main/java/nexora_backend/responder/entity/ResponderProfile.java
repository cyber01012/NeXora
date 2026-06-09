package nexora_backend.responder.entity;//package nexora_backend.responder.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import nexora_backend.database.entity.AdminUser;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "responder_profile")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class ResponderProfile {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "responder_username", referencedColumnName = "username", nullable = false, unique = true)
//    private AdminUser responder;
//
//    @Column(name = "full_name", length = 100)
//    private String fullName;
//
//    @Column(name = "phone_number", length = 20)
//    private String phoneNumber;
//
//    @Column(length = 100)
//    private String email;
//
//    @Column(name = "profile_pic_path", length = 500)
//    private String profilePicPath;
//
//    @Column(name = "department_name", length = 100)
//    private String departmentName;
//
//    @Column(length = 100)
//    private String designation;
//
//    @Column(name = "joining_date")
//    private LocalDate joiningDate;
//
//    @Column(name = "is_active")
//    private Boolean isActive = true;
//
//    @Column(name = "last_password_reset")
//    private LocalDateTime lastPasswordReset;
//}
