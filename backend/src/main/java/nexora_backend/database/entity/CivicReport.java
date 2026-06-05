package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "civic_report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CivicReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long civicId;

    @ManyToOne
    @JoinColumn(name = "citizen_id")
    private RegisterCitizen citizen;

    private String detail;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ComplaintType complaintType;

    @ManyToOne
    @JoinColumn(name = "nature_id")
    private ComplaintNature complaintNature;

    private String province;
    private String district;
    private String town;
    private String area;
    private String city;
    private String evidence;

    // ========== MANUAL GETTERS & SETTERS (in case Lombok fails) ==========
    public Long getCivicId() { return civicId; }
    public void setCivicId(Long civicId) { this.civicId = civicId; }

    public RegisterCitizen getCitizen() { return citizen; }
    public void setCitizen(RegisterCitizen citizen) { this.citizen = citizen; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public ComplaintType getComplaintType() { return complaintType; }
    public void setComplaintType(ComplaintType complaintType) { this.complaintType = complaintType; }

    public ComplaintNature getComplaintNature() { return complaintNature; }
    public void setComplaintNature(ComplaintNature complaintNature) { this.complaintNature = complaintNature; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getTown() { return town; }
    public void setTown(String town) { this.town = town; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getEvidence() { return evidence; }
    public void setEvidence(String evidence) { this.evidence = evidence; }
}