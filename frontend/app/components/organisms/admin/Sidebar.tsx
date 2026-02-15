import Image from 'next/image';
import { Typography } from '@/app/components/atoms/Typography';
import { ThemeChanger } from '@/app/components/molecules/ThemeChanger';
import { LogoutButton } from '@/app/components/organisms/admin/LogoutButton';
import { Navigation } from '@/app/components/organisms/admin/Navigation';
import { css } from '@/styled/css';
import type { FC } from 'react';

type Props = {
  internalUserName: string;
  internalUserRoleName: string;
};

export const Sidebar: FC<Props> = ({
  internalUserName,
  internalUserRoleName,
}) => (
  <aside
    className={css({
      display: {
        base: 'none',
        sm: 'flex',
      },
      flexDir: 'column',
      alignItems: 'center',
      padding: 'lg',
      width: '250px',
    })}
  >
    <div
      className={css({
        my: '2xl',
      })}
    >
      <Image
        src="/ham_media_logo.png"
        alt="ハムメディアロゴ"
        width="170"
        height="170"
        priority={true}
      />
    </div>
    <Navigation internalUserRoleName={internalUserRoleName} />
    <div
      className={css({
        borderTopWidth: 'thin',
        borderColor: 'outline.main',
        mt: '2xl',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 'md',
        width: '100%',
        alignItems: 'center',
      })}
    >
      <Typography
        variant="body1"
        className={css({
          mt: 'md',
        })}
      >
        {internalUserName}
      </Typography>
      <LogoutButton />
      <ThemeChanger />
    </div>
  </aside>
);
