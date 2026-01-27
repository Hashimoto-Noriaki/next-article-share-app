'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { useRouter } from 'next/navigation';

type PropsType = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ArticleReturnButton({ children, ...props }: PropsType) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/articles')}
      className="w-[20%] bg-cyan-600 text-white  font-semibold rounded-full p-5 mt-5 hover:bg-cyan-500"
      {...props}
    >
      {children}
    </button>
  );
}
