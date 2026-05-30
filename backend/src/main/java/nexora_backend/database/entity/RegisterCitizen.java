package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "RegisterCitizen")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterCitizen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fname", nullable = false)
    private String fullName;

    @Column(name = "phone_num", unique = true, nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = true)
    private String email;

    @Column(nullable = true, unique = true)
    private String cnic;

    @Column(nullable = false)
    private String password;

    @Column(name = "email_verified")
    private Boolean emailVerified;

    @Column(name = "entry_date")
    private LocalDate entryDate;

    @Column(name = "entry_time")
    private LocalTime entryTime;
}