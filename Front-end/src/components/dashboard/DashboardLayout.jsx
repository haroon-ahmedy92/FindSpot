import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import Footer from '../common/Footer';

const DashboardLayout = () => {
  useEffect(() => {
    document.body.classList.add('dashboard-active');
    return () => {
      document.body.classList.remove('dashboard-active');
    };
  }, []);

  return (
    <>
      <DashboardHeader />
      <div className="pt-16">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;