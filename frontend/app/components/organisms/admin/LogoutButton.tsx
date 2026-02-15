'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/atoms/Button';
import { removeCookie } from '@/utils/cookies';
import { css } from '@/styled/css';
import { ADMIN_LOGIN_PATH } from '@/utils/routes';
import type { FC } from 'react';

export const LogoutButton: FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    removeCookie();
    router.push(ADMIN_LOGIN_PATH);
  };

  return (
    <Button
      visual="outlined"
      className={css({
        width: '120px',
      })}
      onClick={handleLogout}
    >
      ログアウト
    </Button>
  );
};
