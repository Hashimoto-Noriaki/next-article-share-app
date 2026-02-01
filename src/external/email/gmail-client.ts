import nodemailer from 'nodemailer';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'テックブログ共有アプリ';

// Gmail SMTPトランスポーター
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

type SendPasswordResetEmailParams = {
  email: string;
  token: string;
};

export async function sendPasswordResetEmail({
  email,
  token,
}: SendPasswordResetEmailParams): Promise<{ success: boolean; error?: string }> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #fda4af, #67e8f9); border-radius: 8px; padding: 32px; margin-bottom: 24px;">
        <h1 style="color: white; font-size: 24px; margin: 0 0 16px 0; text-align: center;">
          ${APP_NAME}
        </h1>
        <h2 style="color: white; font-size: 20px; margin: 0 0 24px 0; text-align: center;">
          パスワードリセット
        </h2>
        <p style="margin: 0 0 24px 0; color: white; text-align: center;">
          パスワードリセットがリクエストされました。<br>
          以下のボタンをクリックして、新しいパスワードを設定してください。
        </p>
        <div style="text-align: center;">
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: #059669; color: white; text-decoration: none; padding: 12px 32px; border-radius: 9999px; font-weight: 600;">
            パスワードを再設定する
          </a>
        </div>
      </div>
      
      <div style="color: #64748b; font-size: 14px;">
        <p style="margin: 0 0 8px 0;">
          ⚠️ このリンクは <strong>1時間</strong> で有効期限が切れます。
        </p>
        <p style="margin: 0 0 8px 0;">
          もしパスワードリセットをリクエストしていない場合は、このメールを無視してください。
        </p>
        <p style="margin: 16px 0 0 0; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          ボタンが機能しない場合は、以下のURLをブラウザに貼り付けてください：<br>
          <a href="${resetUrl}" style="color: #059669; word-break: break-all;">${resetUrl}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
${APP_NAME} パスワードリセット

パスワードリセットがリクエストされました。
以下のリンクをクリックして、新しいパスワードを設定してください。

${resetUrl}

このリンクは1時間で有効期限が切れます。

もしパスワードリセットをリクエストしていない場合は、このメールを無視してください。
  `.trim();

  try {
    await transporter.sendMail({
      from: `"${APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `【${APP_NAME}】パスワードリセットのご案内`,
      text: textContent,
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error('メール送信エラー:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'メールの送信に失敗しました',
    };
  }
}
