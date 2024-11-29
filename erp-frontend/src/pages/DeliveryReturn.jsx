import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTruckArrowRight } from 'react-icons/fa6';
import PickupTab from './DeliveryTabs/PickupTab';
import ReturnTab from './DeliveryTabs/ReturnTab';
import DropOffTab from './DeliveryTabs/DropOffTab';
import InventoryTab from './DeliveryTabs/InventoryTab';

const DeliveryReturn = ({ api }) => {
  const [drivers, setDrivers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);

 
  const [activeTab, setActiveTab] = useState('pickup');

  const [codeType, setCodeType] = useState('box');



  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${api}/drivers/`);
        setDrivers(response.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error fetching drivers');
      }
    };

    const fetchWarehouses = async () => {
      try {
        const response = await axios.get(`${api}/warehouses/`);
        setWarehouses(response.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error fetching warehouses');
      }
    };

    const fetchStores = async () => {
      try {
        const response = await axios.get(`${api}/stores/`);
        setStores(response.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error fetching stores');
      }
    };

    fetchDrivers();
    fetchWarehouses();
    fetchStores();
  }, [api]);


 



  return (
    <div className="">
      <ToastContainer />

      <h1 className="text-4xl md:text-7xl lg:text-8xl flex mb-4">
        <FaTruckArrowRight className="mr-2" /> Delivery / Return / Drop Off
      </h1>

      {/* Tabs for Pickup, Return, and Drop Off */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`p-3 rounded-t-lg ${activeTab === 'pickup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('pickup')}
        >
          Pickup
        </button>
        <button
          className={`p-3 rounded-t-lg ${activeTab === 'return' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('return')}
        >
          Return
        </button>
        <button
          className={`p-3 rounded-t-lg ${activeTab === 'dropoff' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('dropoff')}
        >
          Drop Off
        </button>

        <button
          className={`p-3 rounded-t-lg ${activeTab === 'inventory' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('inventory')}
        >
         Inventory
        </button>
      </div>

      {/* Code Type Selection */}
      <div className="mb-4 p-4 border border-blue-500 rounded-lg bg-blue-50">
        <span className="font-bold text-lg text-blue-700">Select Code Type:</span>
        <div className="flex items-center space-x-6 mt-4">
          <label className="flex items-center text-lg">
            <input
              type="radio"
              value="box"
              checked={codeType === 'box'}
              onChange={(e) => setCodeType(e.target.value)}
              className="mr-2 h-6 w-6 accent-blue-600"
            />
            <span className="font-semibold">Box Code</span>
          </label>
          <label className="flex items-center text-lg">
            <input
              type="radio"
              value="product"
              checked={codeType === 'product'}
              onChange={(e) => setCodeType(e.target.value)}
              className="mr-2 h-6 w-6 accent-blue-600"
            />
            <span className="font-semibold">Product Code</span>
          </label>
        </div>
      </div>

      {/* Pickup Tab Content */}
     
      {activeTab === 'pickup' && (
          <PickupTab
          drivers={drivers}
          warehouses={warehouses}
          api = {api}
          codeType={codeType}
      
        />
       
      )}

      {/* Return Tab Content */}
      {activeTab === 'return' && (
        <ReturnTab
        drivers={drivers}
        warehouses={warehouses}
        stores={stores}
        api = {api} 
        codeType={codeType}
        warehouses={warehouses}
    
        />
     
        
      )}

      {/* Drop Off Tab Content */}
      {activeTab === 'dropoff' && (
        <DropOffTab 
        drivers={drivers}
        stores={stores}
        api = {api}
        codeType={codeType}
        
        />
      
      )}

      {/* Drop Off Tab Content */}
      {activeTab === 'inventory' && (
        <InventoryTab 
        drivers={drivers}
        stores={stores}
        warehouses={warehouses}
        api = {api}
        codeType={codeType}
   
        />
        
      )}
    </div>
  );
};

export default DeliveryReturn;
