import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState('light');
  const { user, logout } = useAuth(); 
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl.replace("/api","")

  console.log(`${baseUrl}`)
  console.log(`${baseUrl}${user.profile_picture}`)


  // On component mount, check if a theme is saved in localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  // Toggle theme between light and dark
  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="navbar bg-base-100 dark:bg-black ml-0 dark:text-white ">
      <div tabIndex={0} role="button" onClick={toggleSidebar} className="btn btn-ghost btn-circle lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </div>

      {/* Light/dark toggle */}
      <div className='flex gap-2'>
        <p className='text-xs'>Light</p>
        <input
          type="checkbox"
          className="toggle"
          checked={theme === 'dark'}
          onChange={handleThemeToggle}
        />
        <p className='text-xs'>Dark</p>
      </div>

      <div className="flex-1">
        <a className="btn btn-ghost text-lg md:text-xl">ERP Company</a>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <div className="bg-blue-400 rounded-lg p-2 mr-4">
            <h2 className="text-sm font-bold text-white">{user.username}</h2>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img
                src={`${baseUrl}${user.profile_picture}`} alt ="profile pic" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a onClick={logout}>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
