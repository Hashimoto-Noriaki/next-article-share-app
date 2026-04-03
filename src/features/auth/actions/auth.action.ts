'use server';

import {
  signupHandler,
  forgotPasswordHandler,
  validateResetTokenHandler,
  resetPasswordHandler,
} from '@/external/handler/auth/mutation.server';

export async function signupAction(body: unknown) {
  return signupHandler(body);
}

export async function forgotPasswordAction({ email }: { email: string }) {
  return forgotPasswordHandler({ email });
}

export async function validateResetTokenAction({ token }: { token: string }) {
  return validateResetTokenHandler({ token });
}

export async function resetPasswordAction({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  return resetPasswordHandler({ token, password });
}
