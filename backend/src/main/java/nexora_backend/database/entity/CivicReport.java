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

    // ✅ FK to Citizen (ID PK)
    @ManyToOne
    @JoinColumn(name = "citizen_id")  // ✅ use PK
    private RegisterCitizen citizen;

    private String detail;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ComplaintType complaintType;   // ✅ add this

    @ManyToOne
    @JoinColumn(name = "nature_id")
    private ComplaintNature complaintNature;

    private String province;
    private String district;
    private String town;
    private String area;
    private String city;

    private String evidence;  // ✅ folder link (image/video/audio)
}
