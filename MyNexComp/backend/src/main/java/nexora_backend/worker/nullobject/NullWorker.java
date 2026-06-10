package nexora_backend.worker.nullobject;

/**
 * Behavioral Design Pattern: Null Object Pattern
 *
 * NullWorker is returned whenever a VolunteerWorkerCreator cannot be found by username.
 * It implements IWorker with safe, no-op defaults — eliminating NullPointerExceptions
 * throughout the Worker Portal services.
 *
 * Usage:
 *   IWorker worker = volunteerRepository.findByUsernameCreated(username)
 *       .map(VolunteerWorkerAdapter::new)
 *       .orElse(new NullWorker());
 *
 *   if (worker.isNull()) { throw new BusinessException("Worker not found"); }
 */
public class NullWorker implements IWorker {

    @Override
    public String getUsername() {
        return "UNKNOWN";
    }

    @Override
    public String getName() {
        return "Unknown Worker";
    }

    @Override
    public String getPhoneNumber() {
        return "";
    }

    @Override
    public String getEmail() {
        return "";
    }

    @Override
    public String getDepartmentName() {
        return "Unassigned";
    }

    @Override
    public Long getDepartmentId() {
        return null;
    }

    @Override
    public String getDepartmentEmail() {
        return "";
    }

    @Override
    public boolean isNull() {
        return true;
    }
}
