import { NextRequest, NextResponse } from 'next/server';
import { cloudinary } from '@/external/cloudinary';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json(
        { message: 'ファイルが選択されていません' },
        { status: 400 },
      );
    }

    // ファイルサイズチェック（5MB まで）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 },
      );
    }

    // 許可する画像形式
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'JPEG、PNG、GIF、WebP形式のみアップロード可能です' },
        { status: 400 },
      );
    }

    // ファイルを Base64 に変換
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Cloudinary にアップロード
    const result = await cloudinary.uploader.upload(base64, {
      folder: folder,
      resource_type: 'image',
    });

    return NextResponse.json({
      message: 'アップロードが完了しました',
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { message: 'アップロードに失敗しました' },
      { status: 500 },
    );
  }
}
