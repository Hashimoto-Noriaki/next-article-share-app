import { cookies } from 'next/headers'
import { verifyToken } from './jwt'
import { prisma } from './prisma'

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  
  if (!payload) {
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  })
  
  return user
}

// ログインが必須の場合に使う
export async function requireAuth() {
  const user = await getSession()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  return user
}
