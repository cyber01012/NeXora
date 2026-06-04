//package nexora_backend.auth.service;
//
//import nexora_backend.auth.dto.request.ChangePasswordRequest;
//import nexora_backend.database.entity.RegisterCitizen;
//import nexora_backend.database.repository.RegisterCitizenRepository;
//import nexora_backend.shared.exception.BusinessException;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthService {
//
//    private final RegisterCitizenRepository citizenRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public AuthService(RegisterCitizenRepository citizenRepository, PasswordEncoder passwordEncoder) {
//        this.citizenRepository = citizenRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    public void changePassword(Long citizenId, ChangePasswordRequest request) {
//        RegisterCitizen citizen = citizenRepository.findById(citizenId)
//                .orElseThrow(() -> new BusinessException("User not found", HttpStatus.NOT_FOUND));
//
//        // Check current password
//        if (!passwordEncoder.matches(request.getCurrentPassword(), citizen.getPassword())) {
//            throw new BusinessException("Current password is incorrect", HttpStatus.BAD_REQUEST);
//        }
//
//        // Encode and save new password
//        citizen.setPassword(passwordEncoder.encode(request.getNewPassword()));
//        citizenRepository.save(citizen);
//    }
//}