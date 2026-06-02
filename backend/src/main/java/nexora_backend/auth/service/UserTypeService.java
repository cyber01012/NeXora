package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.model.SystemRole;
import nexora_backend.database.entity.UserType;
import nexora_backend.database.repository.UserTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class UserTypeService {

    private static final String[] PORTAL_ROLES = {
            "ADMIN", "NGO", "RESPONDER", "HELP_DESK", "ASSIGNING_OFFICER", "VOLUNTEER", "WORKER"
    };

    private final UserTypeRepository userTypeRepository;

    @Transactional
    public void ensurePortalUserTypesExist() {
        for (String roleName : PORTAL_ROLES) {
            ensureUserType(roleName);
        }
    }

    @Transactional
    public UserType requireUserType(SystemRole role) {
        return userTypeRepository.findByNameIgnoreCase(role.name())
                .orElseGet(() -> ensureUserType(role.name()));
    }

    private UserType ensureUserType(String name) {
        return userTypeRepository.findByNameIgnoreCase(name)
                .orElseGet(() -> {
                    int nextId = userTypeRepository.findAll().stream()
                            .mapToInt(UserType::getId)
                            .max()
                            .orElse(0) + 1;
                    return userTypeRepository.save(UserType.builder()
                            .id(nextId)
                            .name(name.toUpperCase())
                            .build());
                });
    }
}
