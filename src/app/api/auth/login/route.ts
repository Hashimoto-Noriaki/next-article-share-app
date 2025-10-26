import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loginSchema } from '@/shared/lib/validations/auth'
import { createToken } from '@/lib/jwt'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)
    
    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (!user || !user.password) {
      return NextResponse.json(
        { message: 'メールアドレスまたはパスワードが間違っています' },
        { status: 401 }
      )
    }
    
    // パスワード照合
    const isPasswordValid = await bcrypt.compare(
      validatedData.password,
      user.password
    )
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'メールアドレスまたはパスワードが間違っています' },
        { status: 401 }
      )
    }
    
    // JWT発行
    const token = await createToken({ userId: user.id })
    
    // レスポンス作成
    const response = NextResponse.json({
      message: 'ログインに成功しました',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
    
    // Cookie設定
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    return response
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'バリデーションエラー', errors: error.errors },
        { status: 400 }
      )
    }
    
    console.error('ログインエラー:', error)
    return NextResponse.json(
      { message: 'ログインに失敗しました' },
      { status: 500 }
    )
  }
}
