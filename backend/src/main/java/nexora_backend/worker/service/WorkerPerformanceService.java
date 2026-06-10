package nexora_backend.worker.service;

import nexora_backend.database.entity.ForwardedComplaint;
import nexora_backend.database.enums.Decision;
import nexora_backend.database.repository.ForwardedComplaintRepository;
import nexora_backend.database.repository.VolunteerWorkerCreatorRepository;
import nexora_backend.worker.dto.response.WorkerPerformanceResponse;
import nexora_backend.worker.nullobject.IWorker;
import nexora_backend.worker.nullobject.NullWorker;
import nexora_backend.worker.nullobject.VolunteerWorkerAdapter;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class WorkerPerformanceService {

    private final ForwardedComplaintRepository complaintRepository;
    private final VolunteerWorkerCreatorRepository volunteerRepository;

    public WorkerPerformanceService(ForwardedComplaintRepository complaintRepository,
                                    VolunteerWorkerCreatorRepository volunteerRepository) {
        this.complaintRepository = complaintRepository;
        this.volunteerRepository = volunteerRepository;
    }

    public WorkerPerformanceResponse getPerformance(String workerUsername) {
        // Null Object Pattern — safe worker resolution
        IWorker worker = volunteerRepository.findByUsernameCreated(workerUsername)
                .map(VolunteerWorkerAdapter::new)
                .map(w -> (IWorker) w)
                .orElse(new NullWorker());

        // Fetch all assigned complaints for this worker
        List<ForwardedComplaint> allTasks =
                complaintRepository.findByWorker_UsernameCreatedOrderBySubmitDateDesc(workerUsername);

        int total     = allTasks.size();
        int completed = (int) allTasks.stream()
                .filter(c -> c.getWorkerDecision() == Decision.D).count();
        int rejected  = (int) allTasks.stream()
                .filter(c -> c.getWorkerDecision() == Decision.R).count();
        int inProgress = (int) allTasks.stream()
                .filter(c -> Boolean.TRUE.equals(c.getAcceptedByWorker()) && c.getWorkerDecision() == null)
                .count();
        int pending = (int) allTasks.stream()
                .filter(c -> Boolean.TRUE.equals(c.getAssignedToWorker())
                        && !Boolean.TRUE.equals(c.getAcceptedByWorker())
                        && c.getWorkerDecision() == null)
                .count();

        // Completion rate as percentage
        double completionRate = total > 0
                ? Math.round((completed * 100.0 / total) * 10.0) / 10.0
                : 0.0;

        // Derive a simple rating from completion rate (scale: 0–5)
        // 100% → 5.0, 80% → 4.0, etc.
        BigDecimal rating = total > 0
                ? BigDecimal.valueOf(completionRate / 20.0).setScale(1, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Avg response time (hours between submit and accept) — approximate from data
        BigDecimal avgResponseTime = computeAvgResponseTimeMinutes(allTasks);
        BigDecimal avgCompletionTime = computeAvgCompletionTimeHours(allTasks);

        return WorkerPerformanceResponse.builder()
                .workerId(worker.getUsername())
                .totalTasks(total)
                .completedTasks(completed)
                .rejectedTasks(rejected)
                .pendingTasks(pending)
                .inProgressTasks(inProgress)
                .completionRate(completionRate)
                .rating(rating)
                .avgResponseTimeMinutes(avgResponseTime)
                .avgCompletionTimeHours(avgCompletionTime)
                .monthlyCompleted(computeMonthlyCompleted(allTasks))
                .build();
    }

    /** Computes count of completed tasks for each month (Jan=index 0 … Dec=index 11) for the current year. */
    private List<Integer> computeMonthlyCompleted(List<ForwardedComplaint> tasks) {
        int currentYear = LocalDate.now().getYear();
        List<Integer> monthly = new ArrayList<>(java.util.Collections.nCopies(12, 0));

        tasks.stream()
                .filter(c -> c.getWorkerDecision() == Decision.D)
                .filter(c -> c.getAcceptedDate() != null && c.getAcceptedDate().getYear() == currentYear)
                .forEach(c -> {
                    int monthIndex = c.getAcceptedDate().getMonthValue() - 1; // 0-based
                    monthly.set(monthIndex, monthly.get(monthIndex) + 1);
                });

        return monthly;
    }

    /** Estimates average response time in minutes from submit→accept timestamps. */
    private BigDecimal computeAvgResponseTimeMinutes(List<ForwardedComplaint> tasks) {
        long count = tasks.stream()
                .filter(c -> c.getSubmitDate() != null && c.getAcceptedDate() != null)
                .count();

        if (count == 0) return BigDecimal.ZERO;

        double totalMinutes = tasks.stream()
                .filter(c -> c.getSubmitDate() != null && c.getAcceptedDate() != null)
                .mapToDouble(c -> {
                    // Calculate difference in minutes from dates only (approx)
                    long submitEpoch = c.getSubmitDate().toEpochDay() * 24 * 60;
                    long acceptEpoch = c.getAcceptedDate().toEpochDay() * 24 * 60;
                    return Math.max(acceptEpoch - submitEpoch, 0);
                })
                .sum();

        double avg = totalMinutes / count;
        return BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP);
    }

    /** Estimates average completion time in hours from accept→workerDecision. */
    private BigDecimal computeAvgCompletionTimeHours(List<ForwardedComplaint> tasks) {
        long count = tasks.stream()
                .filter(c -> c.getAcceptedDate() != null && c.getWorkerDecision() == Decision.D)
                .count();

        if (count == 0) return BigDecimal.ZERO;

        // Without a completion timestamp column, approximate from date differences
        double totalHours = tasks.stream()
                .filter(c -> c.getAcceptedDate() != null && c.getWorkerDecision() == Decision.D)
                .mapToDouble(c -> {
                    long acceptEpoch  = c.getAcceptedDate().toEpochDay() * 24;
                    long submitEpoch  = c.getSubmitDate() != null ? c.getSubmitDate().toEpochDay() * 24 : acceptEpoch;
                    return Math.max(acceptEpoch - submitEpoch, 0);
                })
                .sum();

        double avg = totalHours / count;
        return BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP);
    }
}
