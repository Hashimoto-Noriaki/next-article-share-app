'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

type PropsType = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SignupButton({ children, ...props }: PropsType) {
  return (
    <button
      className="bg-amber-300 text-white  font-bold rounded-lg p-5 mt-5 hover:bg-amber-200"
      {...props}
    >
      {children}
    </button>
  );
}
