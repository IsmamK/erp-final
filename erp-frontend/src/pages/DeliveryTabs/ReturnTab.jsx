import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';


const ReturnTab = ({ drivers, stores, api, codeType,warehouses }) => {
  const {user} = useAuth()
  const [returnCodes, setReturnCodes] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [successfullyReturned, setSuccessfullyReturned] = useState([]);
  const [errors, setErrors] = useState([]);
  const [summary, setSummary] = useState({ products: 0, boxes: 0, errors: 0 });
 


  // New states for receiving returns
  const [returnId, setReturnId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');

  const handleReturn = async () => {
    if (!selectedDriver || !selectedStore || !returnCodes.trim()) {
      toast.warning('Please select a driver, store, and provide box/product codes for return.');
      return;
    }

    const codesArray = returnCodes.split('\n').map(code => code.trim()).filter(code => code);

    try {
      const response = await axios.post(`${api}/initiate-return/`, {
        driver_id: selectedDriver,
        store_id: selectedStore,
        items: codesArray,
        item_type: codeType,
      });

      const { successfully_updated, errors, total_products_updated, total_errors } = response.data;

      // Update state with the response data
      setSuccessfullyReturned(successfully_updated);
      setErrors(errors);

      // Update summary with total counts from the response
      setSummary({
        products: total_products_updated,
        boxes: codeType === 'box' ? total_products_updated : 0, // Assuming total products updated as boxes when codeType is 'box'
        errors: total_errors,
      });

      toast.success('Return assigned successfully');
      setReturnCodes('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error assigning return');
    }
  };

  // New function to handle receiving the return
  const handleReceiveReturn = async () => {
    if (!warehouseId.trim()) {
      toast.warning('Please select a warehouse.');
      return;
    }

    const codesArray = returnCodes.split('\n').map(code => code.trim()).filter(code => code);

    if (codesArray.length === 0) {
      toast.warning('Please provide valid product or box codes.');
      return;
    }

    try {
      const response = await axios.post(`${api}/receive-return/`, {
        warehouse_id: warehouseId,
        profile_id: user.profile_id,
        product_codes: codesArray,
        item_type: codeType,
      });

      const { successfully_processed, errors } = response.data;

      setSuccessfullyReturned(prev => [...prev, ...successfully_processed]);
      setErrors(prev => [...prev, ...errors]);

      setSummary({
        products: codeType === 'product' ? successfully_processed.length : 0,
        boxes: codeType === 'box' ? successfully_processed.length : 0,
        errors: errors.length,
      });

      toast.success('Return processed successfully.');
      setWarehouseId('');
      setReturnCodes('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error processing return');
    }
  };
  
  

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Assign Return</h3>

      <label className="block font-semibold mb-2">Select Driver</label>
      <select
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
      >
        <option value="">Select Driver</option>
        {drivers.map(driver => (
          <option key={driver.id} value={driver.id}>
            {driver.first_name} {driver.last_name}
          </option>
        ))}
      </select>

      <label className="block font-semibold mb-2">Select Store</label>
      <select
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selectedStore}
        onChange={(e) => setSelectedStore(e.target.value)}
      >
        <option value="">Select Store</option>
        {stores.map(store => (
          <option key={store.id} value={store.id}>
            {store.name}
          </option>
        ))}
      </select>

      <textarea
  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
  rows="5"
  placeholder="Paste box/product codes here for receiving return"
  value={returnCodes}
  onChange={(e) => setReturnCodes(e.target.value)}
></textarea>

      <button
        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
        onClick={handleReturn}
      >
        Assign Return
      </button>

      <h3 className="text-xl font-semibold mt-6 mb-2">Receive Return</h3>

<label className="block font-semibold mb-2">Select Warehouse</label>
<select
  className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
  value={warehouseId}
  onChange={(e) => setWarehouseId(e.target.value)}
>
  <option value="">Select Warehouse</option>
  {warehouses.map((warehouse) => (
    <option key={warehouse.id} value={warehouse.id}>
      {warehouse.name}
    </option>
  ))}
</select>

<label className="block font-semibold mb-2">Product/Box Codes</label>
<textarea
  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
  rows="5"
  placeholder="Paste product or box codes here, one per line"
  value={returnCodes}
  onChange={(e) => setReturnCodes(e.target.value)}
></textarea>

<button
  className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
  onClick={handleReceiveReturn}
>
  Process Return
</button>



      {/* Successes and Errors Columns */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold text-green-600 mb-2">Successfully Returned</h4>
          <ul className="list-disc list-inside bg-green-50 p-3 rounded-lg border border-green-300">
            {successfullyReturned.map((item, index) => (
              <li key={index} className="text-green-800">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-red-600 mb-2">Errors</h4>
          <ul className="list-disc list-inside bg-red-50 p-3 rounded-lg border border-red-300">
            {errors.map((error, index) => (
              <li key={index} className="text-red-800">
                {error.item_code}: {error.error}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default ReturnTab;
