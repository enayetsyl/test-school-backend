// src/types/user.types.ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'supervisor';
  emailVerified: boolean;
  status: 'active' | 'inactive';
  isLockedFromStep1?: boolean;
  createdAt: Date;
  updatedAt: Date;
  password?: string; // never expose
  // add any other internal fields here if needed
}

export interface IPublicUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'supervisor';
  emailVerified: boolean;
  status: 'active' | 'inactive';
  isLockedFromStep1: boolean;
  createdAt: Date;
  updatedAt: Date;
}
