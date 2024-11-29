import { React, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PickupTab = ({ drivers, warehouses, api ,codeType }) => {
  const [pickupCodes, setPickupCodes] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [successfullyAdded, setSuccessfullyAdded] = useState([]);
  const [errors, setErrors] = useState([]);
  const {user} = useAuth()
  axios.defaults.withCredentials = true;


  const handlePickup = async () => {
    if (!selectedDriver || !selectedWarehouse || !pickupCodes.trim()) {
      toast.warning('Please select a driver, warehouse, and provide box/product codes for pickup.');
      return;
    }

    const codesArray = pickupCodes.split('\n').map(code => code.trim()).filter(code => code);

    try {
      const response = await axios.post(`${api}/create-pickup/`, {
        driver_id: selectedDriver,
        warehouse_id: selectedWarehouse,
        items: codesArray,
        item_type: codeType,
        created_by:user.profile_id,
      });

      const { successfully_added, errors, total_products_added, total_errors } = response.data;

      // Update state with the response data
      setSuccessfullyAdded(successfully_added);
      setErrors(errors);

      // Update summary with total counts from the response
      setSummary({ 
        products: total_products_added, 
        boxes: codeType === 'box' ? total_products_added : 0, // Assuming total products added as boxes when codeType is 'box'
        errors: total_errors 
      });

      toast.success('Pickup assigned successfully');
      setPickupCodes('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error assigning pickup');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Assign Pickup</h3>

      <label className="block font-semibold mb-2">Select Driver</label>
      <select
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
      >
        <option value="">Select Driver</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.first_name} {driver.last_name}
          </option>
        ))}
      </select>

      <label className="block font-semibold mb-2">Select Warehouse</label>
      <select
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selectedWarehouse}
        onChange={(e) => setSelectedWarehouse(e.target.value)}
      >
        <option value="">Select Warehouse</option>
        {warehouses.map((warehouse) => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </option>
        ))}
      </select>

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="5"
        placeholder={`Paste ${codeType === 'box' ? 'box' : 'product'} codes here for pickup`}
        value={pickupCodes}
        onChange={(e) => setPickupCodes(e.target.value)}
      ></textarea>

      <button
        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
        onClick={handlePickup}
      >
        Assign Pickup
      </button>

   
      {/* Successes and Errors Columns */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold text-green-600 mb-2">Successfully Added</h4>
          <ul className="list-disc list-inside bg-green-50 p-3 rounded-lg border border-green-300">
            {successfullyAdded.map((item, index) => (
              <li key={index} className="text-green-800">
                {item} {/* Directly displaying the item code from the success list */}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-red-600 mb-2">Errors</h4>
          <ul className="list-disc list-inside bg-red-50 p-3 rounded-lg border border-red-300">
            {errors.map((error, index) => (
              <li key={index} className="text-red-800">
                {error.item_code}: {error.error} {/* Displaying error details */}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default PickupTab;
