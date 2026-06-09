package nexora_backend.helpdesk.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SOSRequest {

    private String name;

    private String callerPhone;

    private String province;

    private String district;

    private String town;

    private String area;

    private String city;

    private Long complaintNatureId;

    private String detail;

    private String priority;
}