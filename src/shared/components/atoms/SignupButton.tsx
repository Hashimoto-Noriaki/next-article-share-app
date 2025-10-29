'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

type PropsType = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SignupButton({ children, ...props }: PropsType) {
  return (
    <button
      className="bg-amber-500 text-white  font-bold rounded-full p-5 mt-5 hover:bg-amber-400"
      {...props}
    >
      {children}
    </button>
  );
}
