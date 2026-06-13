package nexora_backend.auth.exception;

import org.springframework.http.HttpStatus;

import java.util.Map;

public final class AuthErrors {

    private AuthErrors() {
    }

    // --- Login ---

    public static AuthException loginAccountNotFound() {
        return new AuthException(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.ACCOUNT_NOT_FOUND,
                "No account exists with that email, phone number, or username. Please sign up or double-check your login details.",
                "identifier"
        );
    }

    public static AuthException loginInvalidPassword() {
        return new AuthException(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.INVALID_PASSWORD,
                "The password you entered is incorrect. Please try again or reset your password.",
                "password"
        );
    }

    public static AuthException loginAccountInactive() {
        return new AuthException(
                HttpStatus.FORBIDDEN,
                AuthErrorCode.ACCOUNT_INACTIVE,
                "Your account has been deactivated. Contact your administrator for assistance."
        );
    }

    public static AuthException emailNotVerifiedForLogin() {
        return new AuthException(
                HttpStatus.FORBIDDEN,
                AuthErrorCode.EMAIL_NOT_VERIFIED,
                "Email verification is required before you can log in. Check your inbox for the verification link."
        );
    }

    // --- Registration conflicts ---

    public static AuthException emailAlreadyRegistered() {
        return fieldConflict(
                "email",
                AuthErrorCode.EMAIL_ALREADY_REGISTERED,
                "An account with this email already exists. Try logging in or use a different email address."
        );
    }

    public static AuthException phoneAlreadyRegistered() {
        return fieldConflict(
                "phoneNumber",
                AuthErrorCode.PHONE_ALREADY_REGISTERED,
                "This phone number is already linked to another account. Use a different number or try logging in."
        );
    }

    public static AuthException contactNumberAlreadyRegistered() {
        return fieldConflict(
                "contactNumber",
                AuthErrorCode.CONTACT_NUMBER_ALREADY_REGISTERED,
                "This contact number is already registered to another account."
        );
    }

    public static AuthException cnicAlreadyRegistered() {
        return fieldConflict(
                "cnic",
                AuthErrorCode.CNIC_ALREADY_REGISTERED,
                "This CNIC is already registered. If this is your CNIC, try logging in instead."
        );
    }

    public static AuthException cnicInvalidFormat() {
        return fieldBadRequest(
                "cnic",
                AuthErrorCode.CNIC_INVALID_FORMAT,
                "CNIC format is invalid. Use 13 digits in the format XXXXX-XXXXXXX-X."
        );
    }

    public static AuthException phoneInvalidFormat() {
        return fieldBadRequest(
                "phoneNumber",
                AuthErrorCode.PHONE_INVALID_FORMAT,
                "Phone number format is invalid. Use a valid Pakistani mobile number (e.g. 03001234567)."
        );
    }

    public static AuthException contactNumberInvalidFormat() {
        return fieldBadRequest(
                "contactNumber",
                AuthErrorCode.PHONE_INVALID_FORMAT,
                "Contact number format is invalid. Use a valid Pakistani mobile number (e.g. 03001234567)."
        );
    }

    public static AuthException usernameAlreadyExists() {
        return fieldConflict(
                "username",
                AuthErrorCode.USERNAME_ALREADY_EXISTS,
                "This username is already taken. Please choose a different username."
        );
    }

    public static AuthException usernameCreatedAlreadyExists() {
        return fieldConflict(
                "usernameCreated",
                AuthErrorCode.USERNAME_ALREADY_EXISTS,
                "This username is already taken. Please choose a different username."
        );
    }

    // --- Registration validation ---

    public static AuthException citizenRegistrationRequired() {
        return badRequest(
                AuthErrorCode.REGISTRATION_REQUEST_REQUIRED,
                "Citizen registration data is missing. Please complete all required fields and try again."
        );
    }

    public static AuthException adminRegistrationRequired() {
        return badRequest(
                AuthErrorCode.REGISTRATION_REQUEST_REQUIRED,
                "Portal user registration data is missing. Please complete all required fields and try again."
        );
    }

    public static AuthException volunteerRegistrationRequired() {
        return badRequest(
                AuthErrorCode.REGISTRATION_REQUEST_REQUIRED,
                "Volunteer registration data is missing. Please complete all required fields and try again."
        );
    }

    public static AuthException workerRegistrationRequired() {
        return badRequest(
                AuthErrorCode.REGISTRATION_REQUEST_REQUIRED,
                "Worker registration data is missing. Please complete all required fields and try again."
        );
    }

    public static AuthException departmentNotFound() {
        return fieldBadRequest(
                "category",
                AuthErrorCode.DEPARTMENT_NOT_FOUND,
                "The selected department does not exist. Select a valid department category and try again."
        );
    }

    public static AuthException ngoCategoryRequired() {
        return fieldBadRequest(
                "category",
                AuthErrorCode.NGO_CATEGORY_REQUIRED,
                "Department category is required when registering a portal account."
        );
    }

    public static AuthException categoryNotApplicable() {
        return fieldBadRequest(
                "category",
                AuthErrorCode.CATEGORY_NOT_APPLICABLE,
                "Category can only be provided for NGO accounts."
        );
    }

    public static AuthException categoryNotApplicableForRole() {
        return fieldBadRequest(
                "category",
                AuthErrorCode.CATEGORY_NOT_APPLICABLE,
                "Category is only applicable for NGO accounts."
        );
    }

    public static AuthException creatorDepartmentRequired() {
        return badRequest(
                AuthErrorCode.CREATOR_DEPARTMENT_REQUIRED,
                "Your account is not linked to a department. Contact an administrator before creating users."
        );
    }

    public static AuthException onlyAdminCanCreatePortalAccounts() {
        return forbidden(
                AuthErrorCode.INSUFFICIENT_PERMISSIONS,
                "Only administrators can create portal accounts."
        );
    }

    public static AuthException onlyNgoCanCreateVolunteers() {
        return forbidden(
                AuthErrorCode.INSUFFICIENT_PERMISSIONS,
                "Only NGO users can register volunteers."
        );
    }

    public static AuthException onlyResponderCanCreateWorkers() {
        return forbidden(
                AuthErrorCode.INSUFFICIENT_PERMISSIONS,
                "Only Responder users can register workers."
        );
    }

    public static AuthException adminCannotCreateRole(String role) {
        return badRequest(
                AuthErrorCode.UNSUPPORTED_ROLE,
                "Administrators cannot create accounts with role: " + role + "."
        );
    }

    public static AuthException unsupportedPortalRole(String role) {
        return badRequest(
                AuthErrorCode.UNSUPPORTED_ROLE,
                "Portal registration is not supported for role: " + role + "."
        );
    }

    public static AuthException noRegistrationStrategy(String role) {
        return badRequest(
                AuthErrorCode.UNSUPPORTED_ROLE,
                "Registration is not available for role: " + role + "."
        );
    }

    // --- Tokens & OTP ---

    public static AuthException invalidRefreshToken() {
        return new AuthException(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.INVALID_REFRESH_TOKEN,
                "The refresh token is invalid. Please log in again."
        );
    }

    public static AuthException refreshTokenExpired() {
        return new AuthException(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.REFRESH_TOKEN_EXPIRED,
                "Your session has expired. Please log in again."
        );
    }

    public static AuthException otpExpired() {
        return new AuthException(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.OTP_EXPIRED,
                "The OTP has expired or was not found. Request a new OTP and try again."
        );
    }

    public static AuthException otpInvalid() {
        return new AuthException(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.OTP_INVALID,
                "The OTP you entered is incorrect. Check the code and try again.",
                "otp"
        );
    }

    public static AuthException otpResendLimit(int retryAfterMinutes) {
        return new AuthException(
                HttpStatus.TOO_MANY_REQUESTS,
                AuthErrorCode.OTP_RESEND_LIMIT,
                "OTP resend limit reached. Please try again after " + retryAfterMinutes + " minute(s).",
                Map.of("retryAfterMinutes", retryAfterMinutes)
        );
    }

    public static AuthException otpResendUnsupported(String purpose) {
        return badRequest(
                AuthErrorCode.OTP_RESEND_UNSUPPORTED,
                "OTP resend is not supported for purpose: " + purpose + "."
        );
    }

    // --- Password ---

    public static AuthException passwordRecoveryNoEmail() {
        return badRequest(
                AuthErrorCode.PASSWORD_RECOVERY_NO_EMAIL,
                "Password recovery requires a registered email address on your account."
        );
    }

    public static AuthException currentPasswordIncorrect() {
        return fieldBadRequest(
                "currentPassword",
                AuthErrorCode.CURRENT_PASSWORD_INCORRECT,
                "Your current password is incorrect."
        );
    }

    public static AuthException emailNotFound() {
        return new AuthException(
                HttpStatus.NOT_FOUND,
                AuthErrorCode.EMAIL_NOT_FOUND,
                "No account was found with that email address."
        );
    }

    public static AuthException emailAlreadyVerified() {
        return new AuthException(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.EMAIL_ALREADY_VERIFIED,
                "This email address is already verified."
        );
    }

    public static AuthException emailVerificationTokenExpired() {
        return new AuthException(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.EMAIL_VERIFICATION_TOKEN_EXPIRED,
                "The verification link has expired. Request a new verification email."
        );
    }

    public static AuthException emailVerificationTokenInvalid() {
        return new AuthException(
                HttpStatus.BAD_REQUEST,
                AuthErrorCode.EMAIL_VERIFICATION_TOKEN_INVALID,
                "The verification link is invalid. Request a new verification email."
        );
    }

    public static AuthException emailVerificationResendLimit(int retryAfterMinutes) {
        return new AuthException(
                HttpStatus.TOO_MANY_REQUESTS,
                AuthErrorCode.EMAIL_VERIFICATION_RESEND_LIMIT,
                "Verification email resend limit reached. Please try again after " + retryAfterMinutes + " minute(s).",
                Map.of("retryAfterMinutes", retryAfterMinutes)
        );
    }

    public static AuthException responderTypeRequired() {
        return fieldBadRequest(
                "responderTypeId",
                AuthErrorCode.RESPONDER_TYPE_REQUIRED,
                "Responder type is required when registering a Responder account."
        );
    }

    public static AuthException responderTypeNotFound() {
        return fieldBadRequest(
                "responderTypeId",
                AuthErrorCode.RESPONDER_TYPE_NOT_FOUND,
                "The selected responder type does not exist."
        );
    }

    public static AuthException responderTypeNotApplicable() {
        return fieldBadRequest(
                "responderTypeId",
                AuthErrorCode.RESPONDER_TYPE_NOT_APPLICABLE,
                "Responder type can only be provided for Responder accounts."
        );
    }

    // --- Lookup ---

    public static AuthException citizenNotFound() {
        return notFound(AuthErrorCode.USER_NOT_FOUND, "Citizen account not found.");
    }

    public static AuthException adminUserNotFound() {
        return notFound(AuthErrorCode.USER_NOT_FOUND, "Admin user account not found.");
    }

    public static AuthException volunteerWorkerNotFound() {
        return notFound(AuthErrorCode.USER_NOT_FOUND, "Volunteer or worker account not found.");
    }

    public static AuthException ngoUserNotFound() {
        return notFound(AuthErrorCode.USER_NOT_FOUND, "NGO user account not found.");
    }

    public static AuthException responderUserNotFound() {
        return notFound(AuthErrorCode.USER_NOT_FOUND, "Responder user account not found.");
    }

    public static AuthException unsupportedUserSource() {
        return badRequest(
                AuthErrorCode.UNSUPPORTED_USER_SOURCE,
                "The requested operation is not supported for this account type."
        );
    }

    public static AuthException encryptionFailed() {
        return internal(AuthErrorCode.ENCRYPTION_FAILED, "Unable to process sensitive data. Please try again later.");
    }

    public static AuthException decryptionFailed() {
        return internal(AuthErrorCode.DECRYPTION_FAILED, "Unable to read sensitive account data. Please contact support.");
    }

    public static AuthException missingUserType() {
        return internal(AuthErrorCode.INTERNAL_ERROR, "Account configuration is incomplete. Please contact support.");
    }

    // --- Security ---

    public static AuthException unauthorized() {
        return new AuthException(
                HttpStatus.UNAUTHORIZED,
                AuthErrorCode.UNAUTHORIZED,
                "Authentication is required. Please log in and try again."
        );
    }

    public static AuthException accessDenied() {
        return new AuthException(
                HttpStatus.FORBIDDEN,
                AuthErrorCode.ACCESS_DENIED,
                "You do not have permission to access this resource."
        );
    }

    // --- Helpers ---

    public static AuthException badRequest(AuthErrorCode code, String message) {
        return new AuthException(HttpStatus.BAD_REQUEST, code, message);
    }

    public static AuthException forbidden(AuthErrorCode code, String message) {
        return new AuthException(HttpStatus.FORBIDDEN, code, message);
    }

    public static AuthException notFound(AuthErrorCode code, String message) {
        return new AuthException(HttpStatus.NOT_FOUND, code, message);
    }

    public static AuthException internal(AuthErrorCode code, String message) {
        return new AuthException(HttpStatus.INTERNAL_SERVER_ERROR, code, message);
    }

    private static AuthException fieldConflict(String field, AuthErrorCode code, String message) {
        return new AuthException(HttpStatus.CONFLICT, code, message, field);
    }

    private static AuthException fieldBadRequest(String field, AuthErrorCode code, String message) {
        return new AuthException(HttpStatus.BAD_REQUEST, code, message, field);
    }
}
