export const USER_ROLES = ["passenger", "driver", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const VERIFICATION_STATUSES = ["pending", "approved", "rejected"] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const PROFILE_STATUSES = ["pending", "approved", "rejected"] as const;
export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
}