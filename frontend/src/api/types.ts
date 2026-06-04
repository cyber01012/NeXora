export type UserSource = "CITIZEN" | "ADMIN_USER" | "VOLUNTEER_WORKER";

export type SystemRole =
  | "CITIZEN"
  | "ADMIN"
  | "NGO"
  | "RESPONDER"
  | "HELP_DESK"
  | "ASSIGNING_OFFICER"
  | "VOLUNTEER"
  | "WORKER";

export type CitizenBadge = "NONE" | "NORMAL" | "PLATINUM";

export interface UserProfile {
  identifier: string;
  sourceId: string;
  source: UserSource;
  role: SystemRole;
  displayName: string;
  email: string | null;
  maskedPhone: string | null;
  maskedCnic: string | null;
  active: boolean;
  emailVerified: boolean | null;
  cnicValidated: boolean | null;
  citizenBadge: CitizenBadge | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserProfile;
}

export interface RegistrationResponse {
  message: string;
  source: UserSource;
  sourceId: string;
  emailVerificationRequired: boolean;
}

export interface PasswordResetInitResponse {
  message: string;
  source: UserSource;
  sourceId: string;
}

export interface ApiErrorBody {
  timestamp?: string;
  status?: number;
  error?: string;
  code?: string;
  message?: string;
  path?: string;
  field?: string;
  errors?: Record<string, string>;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  field?: string;
  errors?: Record<string, string>;
  details?: Record<string, unknown>;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message ?? "Request failed");
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.field = body.field;
    this.errors = body.errors;
    this.details = body.details;
  }
}
