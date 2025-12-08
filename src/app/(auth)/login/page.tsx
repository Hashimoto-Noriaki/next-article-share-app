'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaLaptopCode } from 'react-icons/fa'
import { Button } from '../../../shared/components/atoms/Button'
import InputForm from '../../../shared/components/atoms/InputForm'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!res.ok) {
        setError('ログインに失敗しました')
        return
      }

      // 成功したらトップページへ
      router.push('/articles')
      router.refresh()
    } catch (err) {
      setError('ログインに失敗しました')
    }
  }

  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-gradient-to-r from-rose-300 to-cyan-400 px-16 py-24 text-center w-full max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">ログイン</h2>

        {error && (
          <div className="w-full rounded-md bg-rose-200 border-rose-300 text-rose-800 px-4 py-2 text-sm text-center shadow-sm">
            ログインに失敗しました
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left mt-5">
          <div>
            <p className="font-bold mb-3">メールアドレス</p>
            <InputForm
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <p className="font-bold mb-3">パスワード</p>
            <InputForm
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button>
            ログイン
          </Button>
          <Link
            href="/signup"
            className="text-center underline mt-5 hover:text-cyan-800"
          >
            新規登録はこちら
          </Link>
        </form>
      </div>
    </div>
  )
}