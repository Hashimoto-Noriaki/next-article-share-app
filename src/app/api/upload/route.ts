import { NextRequest, NextResponse } from 'next/server'
import { cloudinary } from '@/external/cloudinary'
import { auth } from '@/external/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '認証が必要です' },
        { status: 401 },
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json(
        { message: 'ファイルが選択されていません' },
        { status: 400 },
      )
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 },
      )
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'JPEG、PNG、GIF、WebP形式のみアップロード可能です' },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder: folder,
      resource_type: 'image',
    })

    return NextResponse.json({
      message: 'アップロードが完了しました',
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('アップロードエラー:', error)
    return NextResponse.json(
      { message: 'アップロードに失敗しました' },
      { status: 500 },
    )
  }
}
