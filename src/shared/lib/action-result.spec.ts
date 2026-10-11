import { z } from 'zod';
import { ok, fail, validationFail } from './action-result';

describe('action-result', () => {
  describe('ok', () => {
    it('引数なしの場合はdataがundefinedの成功結果を返す', () => {
      expect(ok()).toEqual({ success: true, data: undefined });
    });

    it('引数ありの場合はdataに値を入れた成功結果を返す', () => {
      expect(ok({ id: '1' })).toEqual({ success: true, data: { id: '1' } });
    });
  });

  describe('fail', () => {
    it('errorにメッセージを入れた失敗結果を返す', () => {
      expect(fail('記事が見つかりません')).toEqual({
        success: false,
        error: '記事が見つかりません',
      });
    });
  });

  describe('validationFail', () => {
    const schema = z.object({
      title: z.string().min(1, 'タイトルを入力してください'),
      tags: z.array(z.string().min(1, 'タグを入力してください')),
    });

    it('項目ごとに最初のエラーメッセージをfieldErrorsに入れる', () => {
      const parsed = schema.safeParse({ title: '', tags: ['', ''] });
      if (parsed.success) throw new Error('バリデーションが成功してしまった');

      expect(validationFail(parsed.error)).toEqual({
        success: false,
        error: 'タイトルを入力してください',
        fieldErrors: {
          title: 'タイトルを入力してください',
          tags: 'タグを入力してください',
        },
      });
    });

    it('pathが空のエラーはfieldErrorsに入れない', () => {
      const parsed = z.string().min(1, '入力してください').safeParse('');
      if (parsed.success) throw new Error('バリデーションが成功してしまった');

      expect(validationFail(parsed.error)).toEqual({
        success: false,
        error: '入力してください',
        fieldErrors: {},
      });
    });
  });
});
