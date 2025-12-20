import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

type Props = {
  variant?: 'primary' | 'secondary' | 'slate';
  fullWidth?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  fullWidth = true,
  children,
  className,
  ...props
}: Props) {
  const baseStyle = 'rounded-full font-bold py-3 shadow transition';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg text-white',
    secondary: 'bg-amber-500 hover:bg-amber-400 hover:shadow-lg text-white',
    slate: 'bg-slate-500 hover:bg-slate-400 hover:shadow-lg text-white',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(baseStyle, variants[variant], widthStyle, className)}
      {...props}
    >
      {children}
    </button>
  );
}
