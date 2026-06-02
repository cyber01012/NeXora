package nexora_backend.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nexora_backend.database.entity.AdminUser;
import nexora_backend.database.entity.UserType;
import nexora_backend.database.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Slf4j
@Component
@Order(4)
@RequiredArgsConstructor
public class AdminBootstrapService implements ApplicationRunner {

    private final AdminUserRepository adminUserRepository;
    private final UserTypeService userTypeService;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:}")
    private String adminPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        userTypeService.ensurePortalUserTypesExist();

        if (adminUserRepository.existsByUserType_NameIgnoreCase("ADMIN")) {
            return;
        }

        if (adminEmail == null || adminEmail.isBlank() || adminPassword == null || adminPassword.isBlank()) {
            log.warn("No ADMIN account exists. Set ADMIN_EMAIL and ADMIN_PASSWORD to bootstrap the first admin.");
            return;
        }

        UserType adminType = userTypeService.requireUserType(nexora_backend.auth.model.SystemRole.ADMIN);
        String username = adminEmail.contains("@")
                ? adminEmail.substring(0, adminEmail.indexOf('@')).toLowerCase()
                : adminEmail.toLowerCase();

        if (adminUserRepository.existsById(username)) {
            log.warn("Cannot bootstrap ADMIN account: username '{}' already exists", username);
            return;
        }

        AdminUser adminUser = AdminUser.builder()
                .username(username)
                .userType(adminType)
                .name("System Administrator")
                .email(adminEmail)
                .emailVerified(true)
                .active(true)
                .password(passwordEncoder.encode(adminPassword))
                .date(LocalDate.now())
                .time(LocalTime.now())
                .build();

        adminUserRepository.save(adminUser);
        log.info("Bootstrapped initial ADMIN account for {}", adminEmail);
    }
}
