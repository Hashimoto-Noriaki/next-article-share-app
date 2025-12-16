import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { createArticleSchema } from '@/shared/lib/validations/article'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { message: '認証が必要です' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { message: '認証が無効です' },
        { status: 401 }
      )
    }

    // リクエストボディの取得とバリデーション
    const body = await request.json()
    const validatedData = createArticleSchema.parse(body)

    // 記事作成
    const article = await prisma.article.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        tags: validatedData.tags,
        authorId: payload.userId,
      },
    })

    return NextResponse.json(
      {
        message: '記事を投稿しました',
        article: {
          id: article.id,
          title: article.title,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'バリデーションエラー', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('記事投稿エラー:', error)
    return NextResponse.json(
      { message: '記事の投稿に失敗しました' },
      { status: 500 }
    )
  }
}
