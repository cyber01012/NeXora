package nexora_backend.worker.service;

import nexora_backend.database.enums.Decision;
import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.repository.ForwardedComplaintRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import nexora_backend.worker.dto.response.WorkerDashboardResponse;
import nexora_backend.worker.nullobject.IWorker;
import nexora_backend.worker.nullobject.NullWorker;
import nexora_backend.worker.nullobject.VolunteerWorkerAdapter;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class WorkerDashboardService {

    private final ForwardedComplaintRepository complaintRepository;
    private final VolunteerWorkerCreatorRepository volunteerRepository;

    public WorkerDashboardService(ForwardedComplaintRepository complaintRepository,
                                  VolunteerWorkerCreatorRepository volunteerRepository) {
        this.complaintRepository = complaintRepository;
        this.volunteerRepository = volunteerRepository;
    }

    public WorkerDashboardResponse getDashboard(String workerUsername) {
        // Null Object Pattern: use NullWorker if not found — no NPE
        IWorker worker = volunteerRepository.findByUsernameCreated(workerUsername)
                .map(VolunteerWorkerAdapter::new)
                .map(w -> (IWorker) w)
                .orElse(new NullWorker());

        // Compute counts from ForwardedComplaint data
        long total     = complaintRepository.countByWorker_UsernameCreated(workerUsername);
        long completed = complaintRepository.countByWorker_UsernameCreatedAndWorkerDecision(
                workerUsername, Decision.D);
        long rejected  = complaintRepository.countByWorker_UsernameCreatedAndWorkerDecision(
                workerUsername, Decision.R);
        // Active = assigned, no final decision yet
        long active = complaintRepository.countByWorker_UsernameCreatedAndWorkerDecisionIsNull(workerUsername);

        // Pending acceptance = active AND not yet acceptedByWorker
        long pending = complaintRepository
                .findByWorker_UsernameCreatedOrderBySubmitDateDesc(workerUsername)
                .stream()
                .filter(c -> Boolean.TRUE.equals(c.getAssignedToWorker()))
                .filter(c -> !Boolean.TRUE.equals(c.getAcceptedByWorker()))
                .filter(c -> c.getWorkerDecision() == null)
                .count();

        long inProgress = active - pending;

        // Monthly completed: 12-element list for the current year (Jan=0 … Dec=11)
        List<ForwardedComplaint> allComplaints = complaintRepository
                .findByWorker_UsernameCreatedOrderBySubmitDateDesc(workerUsername);
        List<Integer> monthly = computeMonthlyCompleted(allComplaints);

        return WorkerDashboardResponse.builder()
                .workerUsername(worker.getUsername())
                .workerName(worker.getName())
                .department(worker.getDepartmentName())
                .departmentId(worker.getDepartmentId())
                .totalAssigned(total)
                .pendingAcceptance(pending)
                .inProgress(Math.max(inProgress, 0))
                .completed(completed)
                .rejected(rejected)
                .monthlyCompleted(monthly)
                .build();
    }

    private List<Integer> computeMonthlyCompleted(List<ForwardedComplaint> tasks) {
        int currentYear = LocalDate.now().getYear();
        List<Integer> monthly = new ArrayList<>(Collections.nCopies(12, 0));
        tasks.stream()
                .filter(c -> c.getWorkerDecision() == Decision.D)
                .filter(c -> c.getAcceptedDate() != null && c.getAcceptedDate().getYear() == currentYear)
                .forEach(c -> {
                    int idx = c.getAcceptedDate().getMonthValue() - 1;
                    monthly.set(idx, monthly.get(idx) + 1);
                });
        return monthly;
    }
}
