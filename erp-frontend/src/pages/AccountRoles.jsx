import React, { useState } from 'react';
import { FaUserEdit } from 'react-icons/fa';

const AccountRoles = ({api}) => {
  // Sample personnel data
  const [personnel, setPersonnel] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Superadmin' },
    { id: 2, name: 'Bob Smith', role: 'Admin' },
    { id: 3, name: 'Carol Williams', role: 'Warehouse Officer' },
    { id: 4, name: 'David Brown', role: 'Finance' },
  ]);

  const roles = [
    'Superadmin',
    'Admin',
    'Warehouse Officer',
    'Finance',
  ];

  const handleRoleChange = (id, newRole) => {
    setPersonnel(
      personnel.map((person) =>
        person.id === id ? { ...person, role: newRole } : person
      )
    );
  };

  return (
    <div className='flex flex-col gap-10 dark:text-white dark:bg-black p-6'>
      <h1 className='text-4xl md:text-7xl lg:text-8xl flex'>
        <FaUserEdit className='mr-2' /> Account Roles
      </h1>

      {/* Superadmin Section */}
      <div>
        <h2 className='text-2xl font-bold'>Superadmin</h2>
        <div className='overflow-x-auto'>
          <table className='table w-full dark:bg-gray-100 dark:text-white'>
            <thead className='dark:bg-gray-100'>
              <tr className='dark:bg-gray-100 dark:text-black'>
                <th>Personnel Name</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {personnel
                .filter(person => person.role === 'Superadmin')
                .map(person => (
                  <tr key={person.id} className='dark:bg-gray-600'>
                    <td className='dark:text-white'>
                      <div className='font-bold'>{person.name}</div>
                    </td>
                    <td className='dark:text-white'>{person.role}</td>
                    <td className='dark:text-white'>
                      <select
                        value={person.role}
                        onChange={(e) => handleRoleChange(person.id, e.target.value)}
                        className='select select-bordered dark:bg-gray-400'
                      >
                        <option value={person.role}>{person.role}</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Roles Section */}
      <div>
        <h2 className='text-2xl font-bold'>Other Roles</h2>
        <div className='overflow-x-auto'>
          <table className='table w-full dark:bg-gray-100 dark:text-white'>
            <thead className='dark:bg-gray-100'>
              <tr className='dark:bg-gray-100 dark:text-black'>
                <th>Personnel Name</th>
                <th>Current Role</th>
                <th>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {personnel
                .filter(person => person.role !== 'Superadmin')
                .map(person => (
                  <tr key={person.id} className='dark:bg-gray-600'>
                    <td className='dark:text-white'>
                      <div className='font-bold'>{person.name}</div>
                    </td>
                    <td className='dark:text-white'>{person.role}</td>
                    <td className='dark:text-white'>
                      <select
                        value={person.role}
                        onChange={(e) => handleRoleChange(person.id, e.target.value)}
                        className='select select-bordered dark:bg-gray-400'
                      >
                        {roles
                          .filter(role => role !== 'Superadmin')
                          .map(role => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountRoles;
