import React, { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaDownload, FaEye, FaFilter } from 'react-icons/fa';

const Invoices = ({api}) => {
  // Mock invoice data (after delivery completion)
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNumber: 'INV-1001',
      storeName: 'Store A',
      sellerName: 'Warehouse X',
      buyerTax: 'TAX123456',
      sellerTax: 'TAX654321',
      amount: 1200,
      status: 'Paid',
      date: '2024-10-01',
    },
    {
      id: 2,
      invoiceNumber: 'INV-1002',
      storeName: 'Store B',
      sellerName: 'Warehouse Y',
      buyerTax: 'TAX789012',
      sellerTax: 'TAX210987',
      amount: 2300,
      status: 'Unpaid',
      date: '2024-10-05',
    },
    {
      id: 3,
      invoiceNumber: 'INV-1003',
      storeName: 'Store A',
      sellerName: 'Warehouse Z',
      buyerTax: 'TAX246810',
      sellerTax: 'TAX135791',
      amount: 1750,
      status: 'Paid',
      date: '2024-09-28',
    },
  ]);
  
  // Filters
  const [storeFilter, setStoreFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Filtered invoices based on store and date
  const filteredInvoices = invoices.filter(invoice => {
    return (
      (storeFilter === '' || invoice.storeName === storeFilter) &&
      (dateFilter === '' || invoice.date === dateFilter)
    );
  });

  // Handle filters
  const handleStoreFilter = (e) => {
    setStoreFilter(e.target.value);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
  };

  return (
    <div className="flex flex-col gap-10 p-6 dark:bg-black dark:text-white">
      <h1 className="text-4xl md:text-7xl lg:text-8xl flex">
        <FaFileInvoiceDollar className="mr-2" /> Invoices 
      </h1>
      
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="storeFilter" className="text-lg font-semibold">Filter by Store</label>
          <select
            id="storeFilter"
            value={storeFilter}
            onChange={handleStoreFilter}
            className="input input-bordered dark:bg-gray-600 dark:text-white"
          >
            <option value="">All Stores</option>
            <option value="Store A">Store A</option>
            <option value="Store B">Store B</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="dateFilter" className="text-lg font-semibold">Filter by Date</label>
          <input
            type="date"
            id="dateFilter"
            value={dateFilter}
            onChange={handleDateFilter}
            className="input input-bordered dark:bg-gray-600 dark:text-white"
          />
        </div>
      </div>
      
      {/* Invoices Table */}
      <div>
        <h2 className="text-2xl font-bold">Invoices</h2>
        <div className="overflow-x-auto">
          <table className="table w-full dark:bg-gray-600">
            <thead className="dark:bg-gray-800 dark:text-white">
              <tr>
                <th>Invoice Number</th>
                <th>Store Name</th>
                <th>Seller Name</th>
                <th>Buyer Tax ID</th>
                <th>Seller Tax ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="dark:bg-gray-700">
                    <td className="dark:text-white">{invoice.invoiceNumber}</td>
                    <td className="dark:text-white">{invoice.storeName}</td>
                    <td className="dark:text-white">{invoice.sellerName}</td>
                    <td className="dark:text-white">{invoice.buyerTax}</td>
                    <td className="dark:text-white">{invoice.sellerTax}</td>
                    <td className="dark:text-white">${invoice.amount}</td>
                    <td className={`dark:text-white ${invoice.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                      {invoice.status}
                    </td>
                    <td className="dark:text-white">{invoice.date}</td>
                    <td className="flex gap-2">
                      <button className="btn btn-sm btn-info dark:bg-blue-600">
                        <FaEye className="mr-2" /> View
                      </button>
                      <button className="btn btn-sm btn-warning dark:bg-yellow-500">
                        <FaDownload className="mr-2" /> Download
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center dark:text-white">No invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
