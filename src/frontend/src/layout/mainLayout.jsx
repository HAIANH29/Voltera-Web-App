import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderBefore from '../components/headerBefore/headerBefore';
import FooterComponent from '../components/footer/footer';
import HeaderAfter from '../components/headerAfter/headerAfter';

const { Content } = Layout;

export default function MainLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header với navigation */}
      <HeaderBefore />

      {/* Main Content Area */}
      <Content
        style={{
          flex: 1,
          background: '#ffffff',
          minHeight: 'calc(100vh - 120px)', // Trừ đi height của header và footer
        }}
      >
        {/* Sử dụng Outlet cho router hoặc children trực tiếp */}
        {children ?? <Outlet />}
      </Content>

      {/* Footer Component */}
      <FooterComponent />
    </Layout>
  );
}
