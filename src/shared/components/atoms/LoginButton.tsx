'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

type PropsType = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LoginButton({ children, ...props }: PropsType) {
  return (
    <button
      className="w-full bg-emerald-600 hover:shadow-lg text-white rounded-full font-bold py-3 mt-5 shadow hover:bg-emerald-500 transition"
      {...props}
    >
      {children}
    </button>
  );
}
