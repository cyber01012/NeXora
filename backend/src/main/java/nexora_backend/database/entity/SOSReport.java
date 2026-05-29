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
}