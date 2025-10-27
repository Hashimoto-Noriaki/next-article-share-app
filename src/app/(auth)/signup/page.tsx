'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaLaptopCode } from 'react-icons/fa'
import InputForm from '../../../shared/components/atoms/InputForm'
import SignupButton from '../../../shared/components/atoms/SignupButton'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (!res.ok) {
        setErrorMessage('登録に失敗しました')
        return
      }

      // 成功したら記事一覧ページへ
      router.push('/articles')
    } catch (err) {
      setErrorMessage('登録に失敗しました')
    }
  }

  return (
    <div className="flex items-center justify-center p-20 max-h-screen">
      <div className="bg-gradient-to-r from-cyan-400 to-cyan-500 px-16 py-24 text-center w-full max-w-md rounded-md">
        <h1 className="text-2xl flex items-center text-white font-bold">
          <FaLaptopCode />
          テックブログ共有アプリ
        </h1>
        <h2 className="text-xl text-white font-bold mt-3">新規登録</h2>

        {errorMessage && (
          <div className="w-full rounded-md bg-rose-200 border-rose-300 text-rose-800 px-4 py-2 text-sm text-center shadow-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left mt-5">
          <div>
            <p className="font-bold mb-3">名前</p>
            <InputForm
              name="name"
              placeholder="例)山田太郎(ニックネーム可)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <p className="font-bold mb-3">メールアドレス</p>
            <InputForm
              name="email"
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
              name="password"
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <SignupButton>
            新規登録
          </SignupButton>
          <Link
            href="/login"
            className="text-center underline mt-5 hover:text-cyan-800"
          >
            ログインはこちら
          </Link>
        </form>
      </div>
    </div>
  )
}
