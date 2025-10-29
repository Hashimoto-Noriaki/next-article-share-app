import { ReactNode, ButtonHTMLAttributes } from 'react';

type PropsType = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function SignupButton({ children, ...props }: PropsType) {
  return (
    <button
      className="w-full bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-bold py-3 mt-5 shadow hover:shadow-lg transition"
      {...props}
    >
      {children}
    </button>
  );
}
