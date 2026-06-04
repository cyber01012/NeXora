package nexora_backend.database.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "anonymous_report")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
}