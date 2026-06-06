package nexora_backend.citizen.components;

import nexora_backend.database.entity.*;

public class CivicReportComponents {

    public static RegisterCitizen createCitizen(Long id) {
        RegisterCitizen citizen = new RegisterCitizen();
        citizen.setId(id);
        return citizen;
    }
    public static ComplaintType createCivicType() {
        ComplaintType type = new ComplaintType();
        type.setId(2);
        return type;
    }

    public static ComplaintNature createNature(String typeName) {
        ComplaintNature nature = new ComplaintNature();
        nature.setId(getNatureId(typeName));
        return nature;
    }

    public static CivicReport createReport(
            RegisterCitizen citizen,
            ComplaintType type,
            ComplaintNature nature,
            String description,
            String province,
            String district,
            String town,
            String area,
            String city,
            String mediaPath) {

        CivicReport report = new CivicReport();

        report.setCitizen(citizen);
        report.setComplaintType(type);
        report.setComplaintNature(nature);
        report.setDetail(description);
        report.setProvince(province);
        report.setDistrict(district);
        report.setTown(town);
        report.setArea(area);
        report.setCity(city);
        report.setEvidence(mediaPath);
        report.setStatus("PENDING_ADMIN");

        return report;
    }

    private static Integer getNatureId(String type) {
        if (type == null) return 7;
        switch (type.toUpperCase()) {
            case "ELECTRICITY": return 7;
            case "GAS": return 8;
            case "ROAD": return 9;
            case "WATER": return 10;
            case "MEDICAL": return 1;
            default: return 7;
        }
    }
}