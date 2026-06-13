package nexora_backend.worker.nullobject;

import nexora_backend.database.entity.VolunteerWorkerCreator;

/**
 * Adapter that wraps a real VolunteerWorkerCreator entity and exposes it
 * through the IWorker interface. Paired with NullWorker for the Null Object Pattern.
 */
public class VolunteerWorkerAdapter implements IWorker {

    private final VolunteerWorkerCreator worker;

    public VolunteerWorkerAdapter(VolunteerWorkerCreator worker) {
        this.worker = worker;
    }

    @Override
    public String getUsername() {
        return worker.getUsernameCreated();
    }

    @Override
    public String getName() {
        return worker.getName() != null ? worker.getName() : "";
    }

    @Override
    public String getPhoneNumber() {
        return worker.getPhoneNumber() != null ? worker.getPhoneNumber() : "";
    }

    @Override
    public String getEmail() {
        return worker.getEmail() != null ? worker.getEmail() : "";
    }

    @Override
    public String getDepartmentName() {
        return (worker.getDepartment() != null && worker.getDepartment().getDeptName() != null)
                ? worker.getDepartment().getDeptName()
                : "Unassigned";
    }

    @Override
    public Long getDepartmentId() {
        return worker.getDepartment() != null ? worker.getDepartment().getDeptId() : null;
    }

    @Override
    public String getDepartmentEmail() {
        return (worker.getDepartment() != null && worker.getDepartment().getDeptEmail() != null)
                ? worker.getDepartment().getDeptEmail()
                : "";
    }

    @Override
    public boolean isNull() {
        return false;
    }

    /** Provides access to the underlying entity when needed by services. */
    public VolunteerWorkerCreator getEntity() {
        return worker;
    }
}
