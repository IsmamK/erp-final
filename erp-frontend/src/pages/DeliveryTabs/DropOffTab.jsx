import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Ensure toast is imported for notifications

const DropOffTab = ({ drivers, stores, api, codeType }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [dropOffCodes, setDropOffCodes] = useState('');
  const [successfullyAdded, setSuccessfullyAdded] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleDropOff = async () => {
    // Validate inputs
    if (!selectedDriver || !selectedStore || !dropOffCodes.trim()) {
      toast.warning('Please select a driver, store, and provide box/product codes for drop off.');
      return;
    }

    const codesArray = dropOffCodes.split('\n').map(code => code.trim()).filter(code => code);

    try {
      const response = await axios.post(`${api}/create-dropoff/`, {
        driver_id: selectedDriver,
        store_id: selectedStore,
        items: codesArray,
        item_type: codeType
      });

      const { successfully_added, errors, total_products_added, total_errors } = response.data;

      // Update state with the response data
      setSuccessfullyAdded(successfully_added);
      setErrors(errors);

      // Notify the user about the success
      toast.success('Drop Off assigned successfully');
      setDropOffCodes('');
    } catch (error) {
      // Handle error response
      toast.error(error.response?.data?.error || 'Error assigning drop off');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Assign Drop Off</h3>

      <label className="block font-semibold mb-2">Select Store</label>
      <select
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        value={selectedStore}
        onChange={(e) => setSelectedStore(e.target.value)}
      >
        <option value="">Select Store</option>
        {stores.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>

      <label className="block font-semibold mb-2">Select Driver</label>
      <select
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
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

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        rows="5"
        placeholder={`Paste ${codeType === 'box' ? 'box' : 'product'} codes here for drop off`}
        value={dropOffCodes}
        onChange={(e) => setDropOffCodes(e.target.value)}
      ></textarea>
      
      <button
        className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-200"
        onClick={handleDropOff}
      >
        Assign Drop Off
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

export default DropOffTab;
