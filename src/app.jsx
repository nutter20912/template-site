import { ConfigProvider } from 'antd';
import React from 'react';
import Router from './router';

/**
 * 應用程式
 *
 * @returns
 */
export default function App() {
  const themeObject = {
    components: {
      Layout: {
        colorBgHeader: 'white',
      },
    },
  };

  return (
    <ConfigProvider theme={themeObject}>
      <Router />
    </ConfigProvider>
  );
}
