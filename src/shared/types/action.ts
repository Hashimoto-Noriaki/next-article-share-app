// Server Actions / handler の戻り値。想定内の失敗は throw せずにこの型で返す
export type ActionSuccess<T> = { success: true; data: T };

export type ActionFailure = {
  success: false;
  error: string;
  // Zod のバリデーションエラー。キーは入力項目名、値は最初のエラーメッセージ
  fieldErrors?: Record<string, string>;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionFailure;
