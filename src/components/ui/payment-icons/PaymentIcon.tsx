'use client';

import { cn } from '@/lib/utils';
import { PaymentType } from '@/types/payment';

type IconConfig = {
  path: string;
  colors?: {
    primary: string;
    secondary?: string;
    background?: string;
  };
};

const iconConfigs: Record<PaymentType, IconConfig> = {
  visa: {
    path: 'M14.5 5.725H12L8.6875 14.275H11.1875L14.5 5.725ZM7.89375 5.725L5.525 11.8313L5.2375 10.65C4.7625 9.28125 3.4125 7.8 1.875 7.0625L4.0375 14.2688H6.5875L10.425 5.725H7.89375ZM0.875 5.725L0.8125 5.9375C3.0625 6.525 4.55 8.0875 5.2375 9.9L4.4875 6.6625C4.35 5.9375 3.7625 5.7875 3.0375 5.725H0.875Z',
    colors: {
      primary: '#1A1F71',
      background: '#ffffff'
    }
  },
  mastercard: {
    path: 'M8.59961 12.9996C7.14961 14.2996 5.19961 14.9996 3.09961 14.9996C1.39961 14.9996 -0.200391 14.4996 -1.50039 13.5996L-1.90039 13.2996V7.79961L-1.50039 7.49961C-0.200391 6.59961 1.39961 6.09961 3.09961 6.09961C5.19961 6.09961 7.14961 6.79961 8.59961 8.09961C10.0496 6.79961 11.9996 6.09961 14.0996 6.09961C15.7996 6.09961 17.3996 6.59961 18.6996 7.49961L19.0996 7.79961V13.2996L18.6996 13.5996C17.3996 14.4996 15.7996 14.9996 14.0996 14.9996C11.9996 14.9996 10.0496 14.2996 8.59961 12.9996Z',
    colors: {
      primary: '#FF5F00',
      secondary: '#FF9F00',
      background: '#ffffff'
    }
  },
  jcb: {
    path: 'M15.3004 6H8.70039C7.80039 6 7.10039 6.7 7.10039 7.6V13.4C7.10039 14.3 7.80039 15 8.70039 15H15.3004C16.2004 15 16.9004 14.3 16.9004 13.4V7.6C16.9004 6.7 16.2004 6 15.3004 6ZM12.0004 12.5C11.1004 12.5 10.4004 11.8 10.4004 10.9C10.4004 10 11.1004 9.3 12.0004 9.3C12.9004 9.3 13.6004 10 13.6004 10.9C13.6004 11.8 12.9004 12.5 12.0004 12.5Z',
    colors: {
      primary: '#0F4C97',
      background: '#ffffff'
    }
  },
  unionpay: {
    path: 'M17 6H3C1.89543 6 1 6.89543 1 8V13C1 14.1046 1.89543 15 3 15H17C18.1046 15 19 14.1046 19 13V8C19 6.89543 18.1046 6 17 6ZM4.5 12.5H3.5V8.5H4.5V12.5ZM7.5 12.5H5.5V8.5H7.5V12.5ZM11.5 12.5H8.5V8.5H11.5V12.5ZM16.5 12.5H12.5V8.5H16.5V12.5Z',
    colors: {
      primary: '#E21836',
      secondary: '#00447C',
      background: '#ffffff'
    }
  },
  momo: {
    path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13.41 18.09V20H10.74V18.07C8.71 17.71 7.15 16.54 7.15 14.67C7.15 12.72 9.02 11.55 11.33 11.55H12.21V9.27C12.21 8.71 11.84 8.28 11.15 8.28C10.46 8.28 10.09 8.71 10.09 9.27H7.41C7.41 7.41 8.97 6.24 11 5.88V4H13.67V5.93C15.7 6.29 17.26 7.46 17.26 9.33C17.26 11.28 15.39 12.45 13.08 12.45H12.2V14.73C12.2 15.29 12.57 15.72 13.26 15.72C13.95 15.72 14.32 15.29 14.32 14.73H17C17 16.59 15.44 17.76 13.41 18.09Z',
    colors: {
      primary: '#AF1A72',
      background: '#fef6fa'
    }
  },
  zalopay: {
    path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12.85 15.15V17H11.15V15.15C9.12 14.79 7.56 13.62 7.56 11.75C7.56 9.8 9.43 8.63 11.74 8.63H12.62V6.35C12.62 5.79 12.25 5.36 11.56 5.36C10.87 5.36 10.5 5.79 10.5 6.35H7.82C7.82 4.49 9.38 3.32 11.41 2.96V1H13.08V2.93C15.11 3.29 16.67 4.46 16.67 6.33C16.67 8.28 14.8 9.45 12.49 9.45H11.61V11.73C11.61 12.29 11.98 12.72 12.67 12.72C13.36 12.72 13.73 12.29 13.73 11.73H16.41C16.41 13.59 14.85 14.76 12.85 15.15Z',
    colors: {
      primary: '#0068FF',
      background: '#EBF3FF'
    }
  }
} as const;

export interface PaymentIconProps {
  type: PaymentType;
  className?: string;
  size?: number;
}

export function PaymentIcon({ type, className, size = 40 }: PaymentIconProps) {
  const config = iconConfigs[type];

  return (
    <svg
      width={size}
      height={size}
      viewBox="-4 -4 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      {config.colors?.background && (
        <rect
          x="-4"
          y="-4"
          width="24"
          height="24"
          fill={config.colors.background}
        />
      )}
      {config.colors?.secondary ? (
        <>
          <path d={config.path.split('Z')[0]} fill={config.colors.primary} />
          <path d={config.path.split('Z')[1]} fill={config.colors.secondary} />
        </>
      ) : (
        <path d={config.path} fill={config.colors?.primary || 'currentColor'} />
      )}
    </svg>
  );
}
