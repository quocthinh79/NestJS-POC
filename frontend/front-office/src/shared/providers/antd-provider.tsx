'use client';

import React from 'react';
import { ConfigProvider } from 'antd';

export const AntdProvider = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 6,
      },
    }}
  >
    {children}
  </ConfigProvider>
);
