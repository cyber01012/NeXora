package nexora_backend.worker.nullobject;

/**
 * Behavioral Design Pattern: Null Object Pattern
 *
 * IWorker defines the contract for a worker entity in the Worker Portal.
 * Implementations: VolunteerWorkerAdapter (real worker) and NullWorker (null object).
 *
 * Using this interface prevents NullPointerExceptions when a worker is not found
 * or when a ForwardedComplaint has no assigned worker.
 */
public interface IWorker {

    /** Returns the unique username of the worker (PK in volunteer_worker table). */
    String getUsername();

    /** Returns the display name of the worker. */
    String getName();

    /** Returns the contact phone number. */
    String getPhoneNumber();

    /** Returns the email address. */
    String getEmail();

    /** Returns the name of the department this worker belongs to. */
    String getDepartmentName();

    /** Returns the ID of the department this worker belongs to. */
    Long getDepartmentId();

    /** Returns the department email address. */
    String getDepartmentEmail();

    /**
     * Returns true if this is a Null Object (no real worker found).
     * Callers can check this to decide whether to throw or handle gracefully.
     */
    boolean isNull();
}
