import React from 'react';
import Header from './Header';
import Footer from './Footer';
import PWAInstallBanner from '@/components/PWAInstallBanner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6">
        {children}
      </main>
      <Footer />
      {/* ✅ PWA install prompt — hidden on /admin pages automatically */}
      <PWAInstallBanner />
    </div>
  );
};

export default MainLayout;