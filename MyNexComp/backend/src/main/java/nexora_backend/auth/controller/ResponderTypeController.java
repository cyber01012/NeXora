package nexora_backend.auth.controller;

import lombok.RequiredArgsConstructor;
import nexora_backend.auth.dto.ResponderTypeResponse;
import nexora_backend.database.entity.ResponderType;
import nexora_backend.database.repository.ResponderTypeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin/responder-types")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ResponderTypeController {

    private final ResponderTypeRepository responderTypeRepository;

    @GetMapping
    public ResponseEntity<List<ResponderTypeResponse>> listResponderTypes() {
        List<ResponderTypeResponse> types = responderTypeRepository.findAll().stream()
                .sorted(Comparator.comparing(ResponderType::getId))
                .map(type -> ResponderTypeResponse.builder()
                        .id(type.getId())
                        .name(type.getName())
                        .build())
                .toList();
        return ResponseEntity.ok(types);
    }
}
