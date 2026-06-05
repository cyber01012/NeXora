//package nexora_backend.responder.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "worker_field_report")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class WorkerFieldReport {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "worker_task_id", nullable = false)
//    private WorkerTaskAssignment workerTask;
//
//    @Column(name = "progress_text", columnDefinition = "TEXT")
//    private String progressText;
//
//    @Column(name = "evidence_image_path", length = 500)
//    private String evidenceImagePath;
//
//    @Column(name = "evidence_video_path", length = 500)
//    private String evidenceVideoPath;
//
//    @Column(name = "location_latitude")
//    private Double locationLatitude;
//
//    @Column(name = "location_longitude")
//    private Double locationLongitude;
//
//    @Column(name = "submitted_at")
//    private LocalDateTime submittedAt;
//
//    @PrePersist
//    protected void onCreate() {
//        submittedAt = LocalDateTime.now();
//    }
//}
