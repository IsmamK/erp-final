import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const InventoryTab = ({ stores, api, codeType,warehouses }) => {
  const [selectedStore, setSelectedStore] = useState('');
  const [inventoryCodes, setInventoryCodes] = useState('');
  const [successfullyMatched, setSuccessfullyMatched] = useState([]);
  const [errors, setErrors] = useState([]);
  const [missingProducts, setMissingProducts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Button state

  const handleInventory = async () => {
    if (!selectedStore || !inventoryCodes.trim()) {
      toast.warning('Please select a store and provide product/box codes for inventory check.');
      return;
    }

    const codesArray = inventoryCodes
      .split('\n')
      .map((code) => code.trim())
      .filter((code) => code);

    setIsSubmitting(true); 

    try {
      const response = await axios.post(`${api}/take-inventory/`, {
        store_id: selectedStore,
        driver_id:"23",
        items: codesArray,
        item_type:codeType,
      });

      const {
        successfully_matched,
        errors: responseErrors,
        missing_products_marked_as_sold,
      } = response.data;

      setSuccessfullyMatched(successfully_matched || []);
      setErrors(responseErrors || []);
      setMissingProducts(missing_products_marked_as_sold || []);

      toast.success('Inventory check completed successfully');
      setInventoryCodes('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error during inventory check');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">Take Inventory</h3>

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

      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        rows="5"
        placeholder={`Paste ${codeType === 'box' ? 'box' : 'product'} codes here for inventory`}
        value={inventoryCodes}
        onChange={(e) => setInventoryCodes(e.target.value)}
      ></textarea>

      <button
        className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition duration-200"
        onClick={handleInventory}
        disabled={isSubmitting} // Disable button during submission
      >
        {isSubmitting ? 'Processing...' : 'Input Inventory'}
      </button>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-lg font-semibold text-green-600 mb-2">Successfully Matched</h4>
          <ul className="list-disc list-inside bg-green-50 p-3 rounded-lg border border-green-300">
            {successfullyMatched.map((item, index) => (
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

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-yellow-600 mb-2">Marked as Sold</h4>
        <ul className="list-disc list-inside bg-yellow-50 p-3 rounded-lg border border-yellow-300">
          {missingProducts.map((item, index) => (
            <li key={index} className="text-yellow-800">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default InventoryTab;
