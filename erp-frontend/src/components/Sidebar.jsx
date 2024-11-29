import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { FaTachometerAlt, FaWarehouse, FaTruck, FaStore, FaFileInvoice, FaChartPie, FaUserShield, FaTimes , FaBox} from 'react-icons/fa'; // Import icons
import { FaTruckArrowRight } from 'react-icons/fa6';
import { useAuth } from '../context/AuthContext';
const apiUrl = import.meta.env.VITE_API_URL;
const baseUrl = apiUrl.replace("/api","")

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth(); 

  return (
    <div
      className={`z-48 dark:text-white fixed dark:bg-blue-800 lg:relative lg:translate-x-0 flex flex-col p-10 dark:border-black border-r border-gray-50 min-h-screen bg-white transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto`} // Added `overflow-y-auto` here
    > 

      {/* Close button for smaller screens */}
      <div className="lg:hidden mb-4 relative -left-4 -top-4">
        <button onClick={toggleSidebar} className="btn btn-ghost">
          Close
          <FaTimes className="text-xl" />
        </button>
      </div>
  
      <h1 className='font-extrabold text-lg md:text-2xl mb-10 pb-10 border-b border-gray-300'>Inventory & ERP Systems</h1>

      <ul className='flex flex-col gap-8 text-xs md:text-sm mb-3'>
        <li>
          <NavLink
            to="/dashboard" // Update this to your dashboard route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaTachometerAlt className='mr-2' /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/warehouse" // Update this to your warehouse route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaWarehouse className='mr-2' /> Warehouse
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products" // Update this to your products route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaBox className='mr-2' /> Products
          </NavLink>
        </li>


        <li>
          <NavLink
            to="/stores" // Update this to your stores route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaStore className='mr-2' /> Stores
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/drivers" // Update this to your delivery route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaTruck className='mr-2' /> Drivers
          </NavLink>

        </li>
        <li>


        <NavLink
            to="/delivery-return" // Update this to your delivery route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaTruckArrowRight className='mr-2' /> Delivery / Return
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/invoices" // Update this to your invoices route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaFileInvoice className='mr-2' /> Invoices
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/analytics" // Update this to your analytics route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaChartPie className='mr-2' /> Analytics
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/account-roles" // Update this to your account roles route
            className={({ isActive }) =>
              `flex items-center rounded-lg font-bold p-2 ${isActive ? 'bg-blue-400 text-white' : 'hover:bg-blue-400 hover:text-white'}`
            }
          >
            <FaUserShield className='mr-2' /> Account Roles
          </NavLink>
        </li>
      </ul>
      <div className="flex mt-20 justify-between items-center border-t border-gray-300 pt-8">
        <button className="btn btn-xs dark:bg-warning text-black btn-warning" onClick={logout}>Log Out</button>
        <div className="avatar">
          <div className="w-10 mask mask-squircle">
            <img src={`${baseUrl}${user.profile_picture}`} alt ="profile pic" />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
