import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET() {
  try {
    const user = await getSession()
    
    if (!user) {
      return NextResponse.json(
        { message: '認証されていません' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({ user })
  } catch (error) {
    console.error('セッション取得エラー:', error)
    return NextResponse.json(
      { message: 'セッション取得に失敗しました' },
      { status: 500 }
    )
  }
}
