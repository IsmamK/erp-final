// Layout Component
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen dark:bg-black">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-grow ml-64 lg:ml-0 dark:bg-black transition-all duration-300">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="p-6 md:p-10 lg:p-20 dark:bg-black min-h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
