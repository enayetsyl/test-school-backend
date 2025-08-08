// src/types/api.ts
export type Meta = Record<string, unknown> | undefined;

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: Meta;
}
