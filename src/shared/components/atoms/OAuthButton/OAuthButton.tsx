'use client';

import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

type Provider = 'github' | 'google';

type Props = {
  provider: Provider;
  mode?: 'login' | 'signup';
  callbackUrl?: string;
};

const providerConfig = {
  github: {
    icon: FaGithub,
    label: 'GitHub',
    className: 'bg-gray-900 text-white hover:bg-gray-800',
  },
  google: {
    icon: FcGoogle,
    label: 'Google',
    className:
      'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
  },
};

export function OAuthButton({
  provider,
  mode = 'login',
  callbackUrl = '/articles',
}: Props) {
  const config = providerConfig[provider];
  const actionText = mode === 'login' ? 'ログイン' : '登録';

  const handleClick = () => {
    signIn(provider, { callbackUrl });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 w-full py-3 rounded-full transition font-bold ${config.className}`}
    >
      <config.icon className="text-xl" />
      {config.label}で{actionText}
    </button>
  );
}
