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

    @Column(name = "entry_date")
    private LocalDate entryDate;

    @Column(name = "entry_time")
    private LocalTime entryTime;

//    ===add====
// Getters
public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getEmail() { return email; }
    public String getCnic() { return cnic; }
    public String getPassword() { return password; }
    public LocalDate getEntryDate() { return entryDate; }
    public LocalTime getEntryTime() { return entryTime; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setAddress(String address) { this.address = address; }
    public void setCity(String city) { this.city = city; }
    public void setEmail(String email) { this.email = email; }
    public void setCnic(String cnic) { this.cnic = cnic; }
    public void setPassword(String password) { this.password = password; }
    public void setEntryDate(LocalDate entryDate) { this.entryDate = entryDate; }
    public void setEntryTime(LocalTime entryTime) { this.entryTime = entryTime; }
}