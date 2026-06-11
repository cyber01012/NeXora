package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sos_report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SOSReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sosId;

    // ✅ NEW: Help Desk user who created SOS
    @ManyToOne
    @JoinColumn(name = "helpdesk_username", referencedColumnName = "username")
    private AdminUser helpDeskUser;

    private String name;

    private String province;
    private String district;
    private String town;
    private String area;
    private String city;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ComplaintType complaintType; // always SOS

    @ManyToOne
    @JoinColumn(name = "nature_id")
    private ComplaintNature complaintNature;

    private String detail;

    private String phoneAutoDetect;

    private String priority;

    @Builder.Default
    @Column(length = 20)
    private String status = "PENDING";

    private String resolvedBy;

    // Manual getter/setter for status (if not using Lombok @Getter/@Setter)
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }
}