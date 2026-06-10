package nexora_backend.auth.service;

import nexora_backend.auth.model.CitizenBadge;
import org.springframework.stereotype.Service;

@Service
public class CitizenBadgeService {

    public CitizenBadge resolve(Boolean emailVerified, Boolean cnicValidated) {
        boolean email = Boolean.TRUE.equals(emailVerified);
        boolean cnic = Boolean.TRUE.equals(cnicValidated);

        if (email && cnic) {
            return CitizenBadge.PLATINUM;
        }
        if (email || cnic) {
            return CitizenBadge.NORMAL;
        }
        return CitizenBadge.NONE;
    }
}
