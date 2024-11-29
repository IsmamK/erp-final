import React, { useEffect, useState } from 'react';
import { FaCar, FaPlus } from 'react-icons/fa';

const Drivers = ({ api }) => {
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    iqama_number: '',
    nationality: '',
    iqama_expiry_date: '',
    driving_license_expiry_date: '',
    status: 'Available',
  });
  const [editDriver, setEditDriver] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usernames, setUsernames] = useState({}); // Store usernames by user ID

  const fetchDrivers = async () => {
    try {
      const response = await fetch(`${api}/drivers/`);
      if (!response.ok) throw new Error('Failed to fetch drivers');
      const data = await response.json();
      setDrivers(data);
      
      // Fetch usernames for each driver
      const userIds = data.map(driver => driver.user).filter(Boolean); // Get unique user IDs
      const uniqueUserIds = [...new Set(userIds)];

      // Fetch all usernames in parallel
      const usernamesData = await Promise.all(uniqueUserIds.map(id => fetchUserName(id)));
      const usernamesMap = uniqueUserIds.reduce((acc, id, index) => {
        acc[id] = usernamesData[index];
        return acc;
      }, {});
      setUsernames(usernamesMap); // Update the usernames state
    } catch (error) {
      console.error(error);
      alert("Error fetching drivers. Please try again.");
    }
  };

  // Function to fetch username by user id
  const fetchUserName = async (userId) => {
    try {
      console.log(userId)
      const response = await fetch(`${api.replace("/api", "")}/auth/users/${userId}/`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const userData = await response.json();
      console.log(userData.username)
      return userData.username; // Return the username from user data
    } catch (error) {
      console.error(error);
      return "N/A"; // Return a default value in case of an error
    }
  };

  const addDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/drivers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to add driver');
      const driverData = await response.json();

      const username = `${formData.first_name.trim()}${formData.last_name.trim().charAt(0)}${driverData.id}`;
      const password = username;
      const baseUrl = api.replace("/api", "");
      const userResponse = await fetch(`${baseUrl}/auth/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!userResponse.ok) throw new Error('Failed to create user');
      const userData = await userResponse.json();

      await fetch(`${api}/drivers/${driverData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userData.id }),
      });

      resetForm();
      fetchDrivers(); // Fetch drivers again to update the list
      document.getElementById('add_driver_modal').close();
    } catch (error) {
      console.error(error);
      alert("Error adding driver. Please try again.");
    }
  };

  const updateDriver = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api}/drivers/${editDriver.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editDriver),
      });

      if (!response.ok) throw new Error('Failed to update driver');
      fetchDrivers(); // Refresh the drivers list after update
      setIsEditing(false);
      setEditDriver({});
      document.getElementById('edit_driver_modal').close();
    } catch (error) {
      console.error(error);
      alert("Error updating driver. Please try again.");
    }
  };

  const deleteDriver = async (id) => {
    try {
      const response = await fetch(`${api}/drivers/${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete driver');
      fetchDrivers(); // Refresh the drivers list after deletion
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error deleting driver. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      contact_number: '',
      iqama_number: '',
      nationality: '',
      iqama_expiry_date: '',
      driving_license_expiry_date: '',
      status: 'Available',
    });
  };

  useEffect(() => {
    fetchDrivers(); // Fetch drivers when component mounts
  }, [api]);

  return (
    <div className="flex flex-col gap-10 dark:text-white dark:bg-black">
      <h1 className="text-4xl md:text-7xl lg:text-8xl flex">
        <FaCar className="mr-2" /> Drivers
      </h1>

      {/* Add Driver Button */}
      <div>
        <button
          className="btn bg-blue-800 hover:bg-blue-400 text-white"
          onClick={() => document.getElementById('add_driver_modal').showModal()}
        >
          <FaPlus className="mr-4" /> Add Driver
        </button>
        <dialog id="add_driver_modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-xl text-center">Add A New Driver</h3>
            <form id="add-driver" className="flex flex-col gap-3 mt-5" onSubmit={addDriver}>
              {Object.keys(formData).map((key) => (
                <label className="input input-bordered flex items-center gap-2" key={key}>
                  <input
                    type={key.includes('date') ? 'date' : 'text'}
                    className="grow"
                    placeholder={key.replace(/_/g, ' ').toUpperCase()}
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  />
                </label>
              ))}
              <div className="text-center">
                <button
                  type="submit"
                  className="btn bg-green-400 hover:bg-green-600 hover:text-white text-gray-800 font-bold"
                >
                  <FaPlus /> ADD
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>

      {/* Drivers Table */}
      <div className="overflow-x-auto dark:bg-black">
        <table className="table w-full dark:bg-gray-100 dark:text-white">
          <thead className="dark:bg-gray-100">
            <tr className="dark:bg-gray-100 dark:text-black">
              <th>Driver Name</th>
              <th>Contact Number</th>
              <th>Iqama Number</th>
              <th>Nationality</th>
              <th>Iqama Expiry</th>
              <th>License Expiry</th>
              <th>Status</th>
              <th>Username</th> {/* Column for displaying username */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id} className="dark:bg-gray-600">
                <td>{driver.first_name} {driver.last_name}</td>
                <td>{driver.contact_number}</td>
                <td>{driver.iqama_number}</td>
                <td>{driver.nationality}</td>
                <td>{driver.iqama_expiry_date}</td>
                <td>{driver.driving_license_expiry_date}</td>
                <td>{driver.status}</td>
                <td>{usernames[driver.user] || "Fetching..."} {/* Display username or loading message */}</td>
                <td className="flex gap-3 items-center">
                  <button
                    className="btn btn-xs md:btn-sm btn-warning text-white"
                    onClick={() => {
                      setEditDriver(driver);
                      setIsEditing(true);
                      document.getElementById('edit_driver_modal').showModal();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs md:btn-sm btn-error text-white"
                    onClick={() => {
                      setDriverToDelete(driver.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Driver Modal */}
      {isDeleteModalOpen && (
        <dialog id="delete_driver_modal" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure you want to delete this driver?</h3>
            <div className="modal-action">
              <button
                className="btn btn-warning"
                onClick={() => deleteDriver(driverToDelete)}
              >
                Yes
              </button>
              <button
                className="btn"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Edit Driver Modal */}
      {isEditing && (
        <dialog id="edit_driver_modal" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-xl text-center">Edit Driver</h3>
            <form className="flex flex-col gap-3 mt-5" onSubmit={updateDriver}>
              {Object.keys(editDriver).map((key) => (
                <label className="input input-bordered flex items-center gap-2" key={key}>
                  <input
                    type={key.includes('date') ? 'date' : 'text'}
                    className="grow"
                    placeholder={key.replace(/_/g, ' ').toUpperCase()}
                    value={editDriver[key] || ''}
                    onChange={(e) => setEditDriver({ ...editDriver, [key]: e.target.value })}
                  />
                </label>
              ))}
              <div className="text-center">
                <button
                  type="submit"
                  className="btn bg-green-400 hover:bg-green-600 hover:text-white text-gray-800 font-bold"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default Drivers;
