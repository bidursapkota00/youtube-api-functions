// src/models/user.model.ts

export interface User {
  uid: string;
  email: string | null;
  fullName: string | null;
  photoUrl: string | null;
  emailVerified: boolean;
  disabled: boolean;
  role: string;
  createdAt: string;
}

export const createUserObject = (user: any): User => {
  return {
    uid: user.uid,
    email: user.email || null,
    fullName: user.displayName || null,
    photoUrl: user.photoURL || null,
    emailVerified: user.emailVerified || false,
    disabled: false,
    role: "student",
    createdAt: new Date().toISOString(),
  };
};
