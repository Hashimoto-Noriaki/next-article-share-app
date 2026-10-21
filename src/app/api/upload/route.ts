import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/external/auth';
import { uploadImageHandler } from '@/external/handler/upload/mutation.server';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 });
    }

    const formData = await request.formData();
    const result = await uploadImageHandler({
      userId: session.user.id,
      file: formData.get('file'),
      folder: formData.get('folder'),
    });

    if (!result.success) {
      return NextResponse.json({ message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: 'アップロードが完了しました',
      url: result.data.url,
      publicId: result.data.publicId,
    });
  } catch (error) {
    console.error('アップロードエラー:', error);
    return NextResponse.json(
      { message: 'アップロードに失敗しました' },
      { status: 500 },
    );
  }
}
