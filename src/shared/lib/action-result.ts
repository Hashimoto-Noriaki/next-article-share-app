import type { z } from 'zod';
import type { ActionFailure, ActionSuccess } from '@/shared/types/action';

export function ok(): ActionSuccess<void>;
export function ok<T>(data: T): ActionSuccess<T>;
export function ok<T>(data?: T) {
  return { success: true as const, data };
}

export function fail(error: string): ActionFailure {
  return { success: false, error };
}

export function validationFail(zodError: z.ZodError): ActionFailure {
  const fieldErrors: Record<string, string> = {};
  for (const issue of zodError.issues) {
    const field = issue.path[0];
    if (field === undefined) continue;
    const key = String(field);
    if (!(key in fieldErrors)) fieldErrors[key] = issue.message;
  }

  return {
    success: false,
    error: zodError.issues[0]?.message ?? '入力内容に誤りがあります',
    fieldErrors,
  };
}
