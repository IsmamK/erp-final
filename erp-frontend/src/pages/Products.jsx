import React, { useState, useEffect } from 'react';
import { FaTrash,FaEye, FaEyeSlash,FaUserAlt, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';

const Products = ({ api }) => {
  const {user} = useAuth()
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [newProduct, setNewProduct] = useState({
    created_by : user.profile_id, 
    name: '',
    box_code: '',
    item_code: '',
    buying_price: '',
    selling_price: '',
    warehouse: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(50);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [activityLogs,setActivityLogs] = useState([])
  const STATUS_CHOICES = [
    'in_warehouse', 'in_transit', 'in_return_transit', 'in_store', 'sold'
  ];

  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [newWarehouse, setNewWarehouse] = useState('');
  const [newStore, setNewStore] = useState('');


  useEffect(() => {
    // const fetchDrivers = async () => {
    //   try {
    //     const response = await axios.get(`${api}/drivers/`);
    //     setDrivers(response.data);
    //   } catch (error) {
    //     toast.error(error.response?.data?.error || 'Error fetching drivers');
    //   }
    // };

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

    // fetchDrivers();
    fetchWarehouses();
    fetchStores();
  }, [api]);

  // Fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${api}/products/`);
        setProducts(response.data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Error fetching products');
      }
    };

    fetchProducts();
  }, [api]);

  const handleAddProduct = async () => {
    try {
      const response = await axios.post(`${api}/products/`, newProduct);
      setProducts([...products, response.data]);
      toast.success('Product added successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error adding product');
    }
  };

  const handleFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const handleBulkUpload = async () => {
    if (!file) {
      toast.warning('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('created_by',user.profile_id)

    try {
      const response = await axios.post(`${api}/products/bulk_upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.success || 'Bulk upload successful');
      setProducts([...products, ...response.data.products]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error uploading file');
    }
  };

  const handleDownloadTemplate = () => {
    window.location.href = `${api}/products/download_template/`;
  };

  const handleSelectProduct = (id) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set());
    } else {
      const allIds = new Set(products.map(product => product.id));
      setSelectedProducts(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${api}/products/${id}/`);
      setProducts(products.filter((product) => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error deleting product');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = Array.from(selectedProducts).map((id) =>
        axios.delete(`${api}/products/${id}/`)
      );
      await Promise.all(deletePromises);
      setProducts(products.filter((product) => !selectedProducts.has(product.id)));
      setSelectedProducts(new Set());
      setSelectAll(false);
      toast.success('Selected products deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error deleting selected products');
    }
  };

   const handleChangeStatus = async () => {
    if (!newStatus) {
      toast.warning('Please select a status');
      return;
    }

    try {
      const updatePromises = Array.from(selectedProducts).map((id) =>
        axios.patch(`${api}/products/${id}/`, { status: newStatus })
      );
      await Promise.all(updatePromises);
      setProducts(products.map(product =>
        selectedProducts.has(product.id)
          ? { ...product, status: newStatus }
          : product
      ));
      setSelectedProducts(new Set());
      setSelectAll(false);
      toast.success('Selected products status updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating product statuses');
    }
  }

  const handleChangeWarehouse = async () => {
    if (newWarehouse === "restrict") {
      toast.warning('Please select a status');
      return;
    }
    console.log("jkdsbjfdskjdfsjndssd")
    console.log(newWarehouse)

    try {
      const updatePromises = Array.from(selectedProducts).map((id) =>
        axios.patch(`${api}/products/${id}/`, { warehouse: newWarehouse })
      );
      await Promise.all(updatePromises);
      setProducts(products.map(product =>
        selectedProducts.has(product.id)
          ? { ...product, warehouse: newWarehouse }
          : product
      ));
      setSelectedProducts(new Set());
      setSelectAll(false);
      toast.success('Selected products status updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating product warehouses');
    }
  }
  
  const handleChangeStore = async () => {
    if (newStore === "restrict") {
      toast.warning('Please select a status');
      return;
    }

    try {
      const updatePromises = Array.from(selectedProducts).map((id) =>
        axios.patch(`${api}/products/${id}/`, { store: newStore })
      );
      await Promise.all(updatePromises);
      setProducts(products.map(product =>
        selectedProducts.has(product.id)
          ? { ...product, store: newStore }
          : product
      ));
      setSelectedProducts(new Set());
      setSelectAll(false);
      toast.success('Selected products store updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating product store');
    }
  }

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pagination component
  const Pagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / productsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-4 mb-4">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`mx-1 px-4 py-2 rounded ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700 hover:bg-blue-500 hover:text-white'}`}
          >
            {number}
          </button>
        ))}
      </div>
    );
  };

  const handleViewActivity = (activity_logs)=>{

    setActivityLogs(activity_logs)

  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-7xl mx-auto">
      <ToastContainer />
      <h1 className="text-4xl font-bold text-center mb-6">Manage Products</h1>

      {/* Manual Add Product Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add Product Manually</h2>
        {/* Form inputs for adding a product */}
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Box Code"
          value={newProduct.box_code}
          onChange={(e) => setNewProduct({ ...newProduct, box_code: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Item Code"
          value={newProduct.item_code}
          onChange={(e) => setNewProduct({ ...newProduct, item_code: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Buying Price"
          value={newProduct.buying_price}
          onChange={(e) => setNewProduct({ ...newProduct, buying_price: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Selling Price"
          value={newProduct.selling_price}
          onChange={(e) => setNewProduct({ ...newProduct, selling_price: e.target.value })}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Warehouse ID"
          value={newProduct.warehouse}
          onChange={(e) => setNewProduct({ ...newProduct, warehouse: e.target.value })}
          className="border p-2 rounded mb-4 w-full"
        />
        <button onClick={handleAddProduct} className="bg-green-600 text-white py-2 px-4 rounded">
          Add Product
        </button>
      </div>

      {/* Bulk Upload Section */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4">Bulk Upload Products</h2>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleDownloadTemplate}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Download Template
          </button>
          <button
            onClick={handleBulkUpload}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
          >
            Upload Products
          </button>
        </div>
      </div>
      {/* Bulk Status Update Section */}
      <div className="mb-6 flex items-center space-x-4">
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Select Status</option>
          {STATUS_CHOICES.map((status) => (
            <option key={status} value={status}>
              {status.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
        <button
          onClick={handleChangeStatus}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Update Status
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <select
          value={newWarehouse}
          onChange={(e) => setNewWarehouse(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="restrict">Select Warehouse</option>
          <option value="">Not in any warehouse</option>
          {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id.toString()}>
                        {warehouse.name}
                      </option>
            ))}
        </select>
        <button
          onClick={handleChangeWarehouse}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Update Warehouse
        </button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <select
          value={newStore}
          onChange={(e) => setNewStore(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="restrict">Select Store</option>
          <option value="">Not in any store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id.toString()}>
              {store.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleChangeStore}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Update Store
        </button>
      </div>
      {/* Delete Selected Button */}
      <div className="mb-4 text-right">
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
        >
          Delete Selected
        </button>
      </div>

      {/* Pagination Controls at the Top */}
      <Pagination />

      {/* Product Table */}
      <div className='max-w-7xl overflow-scroll'>
      <table className="min-w-full border " >
        <thead>
          <tr className="bg-gray-100 text-left">
          <th className="py-2 px-4 border">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Box Code</th>
            <th className="py-2 px-4 border">Item Code</th>
            <th className="py-2 px-4 border">Buying Price</th>
            <th className="py-2 px-4 border">Selling Price</th>
            <th className="py-2 px-4 border">Warehouse</th>
            <th className="py-2 px-4 border">Store</th>
            <th className="py-2 px-4 border">Product Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                />
              </td>
              <td className="py-2 px-4 border">{product.name}</td>
              <td className="py-2 px-4 border">{product.box_code}</td>
              <td className="py-2 px-4 border">{product.item_code}</td>
              <td className="py-2 px-4 border">{product.buying_price}</td>
              <td className="py-2 px-4 border">{product.selling_price}</td>
              <td className='py-2 px-4 border'>
            {/* Warehouse Changer */}
            <select
                    value={product.warehouse}
                    onChange={async (e) => {
                      const newWarehouse = e.target.value;
                      console.log(newWarehouse)
                      await axios.patch(`${api}/products/${product.id}/`, { warehouse: newWarehouse });
                      setProducts(products.map(p =>
                        p.id === product.id ? { ...p, warehouse: newWarehouse } : p
                      ));

                    }}
                      className="border p-2 rounded-md"
                  >
                    <option value="">Not in any Warehouse</option> 
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
             

              </td>
              <td className='py-2 px-4 border'>
                            {/* Store Changer */}

                
                            <select
                    value={product.store || ""}
                    onChange={async (e) => {
                      const newStore = e.target.value || null;
                      await axios.patch(`${api}/products/${product.id}/`, { store: newStore });
                      setProducts(products.map(p =>
                        p.id === product.id ? { ...p, store: newStore } : p
                      ));

                    }}
                      className="border p-2 rounded-md"
                  >
                    <option value="">Not in any Store</option> 
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name || ""}
                      </option>
                    ))}
                  </select>
                
                </td>
              <td className="py-2 px-4 border">
              <select
                    value={product.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      await axios.patch(`${api}/products/${product.id}/`, { status: newStatus });
                      setProducts(products.map(p =>
                        p.id === product.id ? { ...p, status: newStatus } : p
                      ));
                    }}
                    className="border p-2 rounded-md"
                  >
                    {STATUS_CHOICES.map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </td>
              <td className="py-2 px-4 border flex gap-5">
                <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800">
                  <FaTrash className='text-2xl'/>
                </button>
                <button onClick={()=>(handleViewActivity(product.activity_logs))}>
                
                <div class="w-full relative">
{/* <!--scroll inside body--> */}
            {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn" onClick={
  ()=>document.getElementById('activity_log_modal').showModal()


}><FaEye className='text-2xl'/></button>
                <dialog id="activity_log_modal" className="modal" >
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">Track Product Activity</h3>
                    <div className='flex flex-col gap-5'>
                    {activityLogs.map((activityLog)=>(
                     
                      <div role="alert" className="alert alert-warning font-extrabold text-white ">

                          <span className='flex items-center gap-3'>
                            <span className='text-xl flex gap-1'>
                          <FaUserAlt className="text-blue-500" />
                          <FaEdit className="text-green-500" />       
                          </span>                     {activityLog}
                          </span>
                        </div>

                    ))
                    
                    }
                    </div>
                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>
                              
              
              
              </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Pagination Controls at the Bottom */}
      <Pagination />
    </div>
  );
};

export default Products;
