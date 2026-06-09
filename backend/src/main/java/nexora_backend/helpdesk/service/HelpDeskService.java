package nexora_backend.helpdesk.service;

import lombok.RequiredArgsConstructor;

import nexora_backend.auth.model.AuthenticatedUser;

import nexora_backend.database.entity.*;
import nexora_backend.database.repository.*;

import nexora_backend.helpdesk.dto.*;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HelpDeskService {

    private final SOSReportRepository
            sosReportRepository;

    private final AdminUserRepository
            adminUserRepository;

    private final ComplaintNatureRepository
            complaintNatureRepository;

    /* =========================================
       CREATE SOS
    ========================================= */

    public SOSResponse createSOS(

            SOSRequest request,

            AuthenticatedUser user
    ) {

        AdminUser helpDeskUser =

                adminUserRepository
                        .findById(
                                user.getUsername()
                        )

                        .orElseThrow();

        ComplaintNature nature =

                complaintNatureRepository
                        .findById(
                                request.getComplaintNatureId()
                        )

                        .orElseThrow();

        SOSReport report =
                SOSReport.builder()

                        .helpDeskUser(
                                helpDeskUser
                        )

                        .name(
                                request.getName()
                        )

                        .phoneAutoDetect(
                                request.getCallerPhone()
                        )

                        .province(
                                request.getProvince()
                        )

                        .district(
                                request.getDistrict()
                        )

                        .town(
                                request.getTown()
                        )

                        .area(
                                request.getArea()
                        )

                        .city(
                                request.getCity()
                        )

                        .detail(
                                request.getDetail()
                        )

                        .complaintNature(
                                nature
                        )

                        .status("PENDING")

                        .priority(
                                request.getPriority()
                        )

                        .build();

        sosReportRepository.save(report);

        return SOSResponse.builder()

                .sosId(
                        report.getSosId()
                )

                .message(
                        "SOS submitted successfully."
                )

                .status(
                        report.getStatus()
                )

                .build();
    }

    /* =========================================
       DASHBOARD
    ========================================= */

    public Map<String, Object>
    getDashboard() {

        Map<String, Object> data =
                new HashMap<>();

        long totalSOS =
                sosReportRepository.count();

        long pendingSOS =
                sosReportRepository
                        .countByStatus(
                                "PENDING"
                        );

        long resolvedSOS =
                sosReportRepository
                        .countByStatus(
                                "RESOLVED"
                        );

        data.put(
                "totalSOS",
                totalSOS
        );

        data.put(
                "pendingSOS",
                pendingSOS
        );

        data.put(
                "resolvedSOS",
                resolvedSOS
        );

        return data;
    }

    /* =========================================
       RECENT SOS
    ========================================= */

    public List<SOSReport>
    recentSOS() {

        return sosReportRepository
                .findTop10ByOrderBySosIdDesc();
    }

    public List<ComplaintNature>
    getSOSNatures() {

        return complaintNatureRepository
                .findByType_Id(1);
    }
}