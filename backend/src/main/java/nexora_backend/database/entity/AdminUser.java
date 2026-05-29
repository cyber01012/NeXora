package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "admin_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUser {

    // ✅ PRIMARY KEY = username
    @Id
    @Column(nullable = false, unique = true)
    private String username;

    // ✅ FK → UserType
    @ManyToOne
    @JoinColumn(name = "user_type_id")
    private UserType userType;

    private String name;

    @Column(name = "contact_number", unique = true)
    private String contactNumber;

    private String email;

    // ✅ Active / Inactive
    private Boolean active;

    private String password;

    private LocalDate date;

    private LocalTime time;

    private String inactiveRemarks;

    // ✅ NGO / GOV
    private String category;

    // ✅ FK → Department
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;
}