package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "volunteer_worker")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VolunteerWorkerCreator {

    // ✅ PRIMARY KEY (as you said)
    @Id
    private String usernameCreated;

    private String name;

    private String password;

    private Boolean active;

    private String phoneNumber;

    private String email;

    private String profilePic; // ✅ link

    private LocalDate createdDate;

    private LocalTime createdTime;

    // ✅ FK → Department (created by)
    @ManyToOne
    @JoinColumn(name = "dept_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "user_type_id")
    private UserType userType;

    @Builder.Default
    @Column(name = "email_verified")
    private Boolean emailVerified = true;
}
