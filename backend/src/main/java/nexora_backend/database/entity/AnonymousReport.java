package nexora_backend.database.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "anonymous_report")
public class AnonymousReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long anonymousId;

    private String name;
    private String phoneNum;

    private String province;
    private String district;
    private String town;
    private String area;
    private String city;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ComplaintType complaintType;

    @ManyToOne
    @JoinColumn(name = "nature_id")
    private ComplaintNature complaintNature;

    private String evidence;

    private String detail;

    // ========== CONSTRUCTORS ==========
    public AnonymousReport() {}

    // ========== GETTERS & SETTERS ==========
    public Long getAnonymousId() {
        return anonymousId;
    }

    public void setAnonymousId(Long anonymousId) {
        this.anonymousId = anonymousId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public ComplaintType getComplaintType() {
        return complaintType;
    }

    public void setComplaintType(ComplaintType complaintType) {
        this.complaintType = complaintType;
    }

    public ComplaintNature getComplaintNature() {
        return complaintNature;
    }

    public void setComplaintNature(ComplaintNature complaintNature) {
        this.complaintNature = complaintNature;
    }

    public String getEvidence() {
        return evidence;
    }

    public void setEvidence(String evidence) {
        this.evidence = evidence;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }
}