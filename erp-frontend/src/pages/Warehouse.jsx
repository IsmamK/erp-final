import React, { useEffect, useState } from 'react';
import { FaWarehouse, FaPlus, FaDownload } from 'react-icons/fa';

const Warehouse = ({ api }) => {
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for add modal
    const [newWarehouseData, setNewWarehouseData] = useState({
        name: '',
        location: '',
        vat_no: '',
        cr_no: '',
    });

    // Fetch warehouses from API
    useEffect(() => {
        const fetchWarehouses = async () => {
            const response = await fetch(`${api}/warehouses`);
            const data = await response.json();
            setWarehouses(data);
        };
        fetchWarehouses();
    }, [api]);

    const handleEdit = async (warehouse) => {
        const response = await fetch(`${api}/warehouses/${warehouse.id}/`);
        
        if (!response.ok) {
            throw new Error('Unable to fetch warehouse data');
        }
        
        const fetchedWarehouse = await response.json();
        setSelectedWarehouse(fetchedWarehouse);
        setNewWarehouseData({
            name: fetchedWarehouse.name,
            location: fetchedWarehouse.location,
            vat_no: fetchedWarehouse.vat_no,
            cr_no: fetchedWarehouse.cr_no,
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id) => {
        const response = await fetch(`${api}/warehouses/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        setWarehouses(warehouses.filter(w => w.id !== id));
        setIsDeleteModalOpen(false);
    };

    const handleAddWarehouse = async (e) => {
        e.preventDefault();
   
        const response = await fetch(`${api}/warehouses/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWarehouseData),
        });

        if (!response.ok) {
            throw new Error('Unable to create warehouse');
        }

        const newWarehouse = await response.json(); // Get the newly created warehouse
        setWarehouses([...warehouses, newWarehouse]); // Add the new warehouse to the state
        resetNewWarehouseData(); // Reset form data after adding a warehouse
        setIsAddModalOpen(false); // Close the modal
    };

    const resetNewWarehouseData = () => {
        setNewWarehouseData({
            name: '',
            location: '',
            vat_no: '',
            cr_no: '',
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${api}/warehouses/${selectedWarehouse.id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newWarehouseData),
        });

        if (!response.ok) {
            throw new Error('Unable to update warehouse');
        }
        const updatedWarehouse = await response.json();
        setWarehouses(warehouses.map(w => (w.id === updatedWarehouse.id ? updatedWarehouse : w)));
        setIsEditModalOpen(false);
        resetEditModal(); // Reset the modal state after updating
    };

    const resetEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedWarehouse(null);
        resetNewWarehouseData(); // Also reset new warehouse data to clear the form
    };

    return (
        <div className='flex flex-col gap-10 dark:text-white dark:bg-black'>
            <h1 className='text-4xl md:text-7xl lg:text-8xl flex'>
                <FaWarehouse className='mr-4' /> Warehouses
            </h1>

            {/* Add Warehouse Button */}
            <div>
                <button className="btn bg-blue-800 hover:bg-blue-400 text-white" onClick={() => setIsAddModalOpen(true)}>
                    <FaPlus className='mr-4' />
                    Add Warehouse
                </button>

                {isAddModalOpen && (
                    <dialog open className="modal">
                        <div className="modal-box">
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => setIsAddModalOpen(false)}>✕</button>
                            </form>
                            <h3 className="font-bold text-xl text-center">Add A New Warehouse</h3>
                            <form className='flex flex-col gap-3 mt-5' onSubmit={handleAddWarehouse}>
                                <label className="input input-bordered flex items-center gap-2">
                                    <input type="text" className="grow" placeholder="Warehouse Name" required value={newWarehouseData.name} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, name: e.target.value })} />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <input type="text" className="grow" placeholder="Location" required value={newWarehouseData.location} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, location: e.target.value })} />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <input type="text" className="grow" placeholder="VAT No" required value={newWarehouseData.vat_no} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, vat_no: e.target.value })} />
                                </label>
                                <label className="input input-bordered flex items-center gap-2">
                                    <input type="text" className="grow" placeholder="CR No" required value={newWarehouseData.cr_no} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, cr_no: e.target.value })} />
                                </label>
                                <div className='text-center'>
                                    <button className='btn bg-green-400 hover:bg-green-600 hover:text-white text-gray-800 font-bold'>
                                        <FaPlus className='' /> ADD
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                )}
            </div>

            <div className="overflow-x-auto dark:bg-black">
                <table className="table w-full dark:bg-gray-100 dark:text-white">
                    {/* head */}
                    <thead className="dark:bg-gray-100">
                        <tr className="dark:bg-gray-100 dark:text-black">
                            <th>Actions</th>
                            <th>Warehouse Id</th>
                            <th>Warehouse Name</th>
                            <th>Location</th>
                            <th>VAT No.</th>
                            <th>CR No.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map(warehouse => (
                            <tr key={warehouse.id} className="dark:bg-gray-600">
                                <td>
                                    <button className="btn btn-xs md:btn-sm btn-success text-white">
                                        <FaDownload className='' /> Download Inventory Report
                                    </button>
                                </td>
                                <td className="dark:text-white">{warehouse.id}</td>
                                <td className="dark:text-white">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-bold">{warehouse.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="dark:text-white">{warehouse.location}</td>
                                <td className="dark:text-white">{warehouse.vat_no}</td>
                                <td className="dark:text-white">{warehouse.cr_no}</td>
                                <td className="flex gap-3 dark:text-white">
                                    <button className="btn btn-xs md:btn-sm btn-warning text-white" onClick={() => handleEdit(warehouse)}>Edit</button>
                                    <button className="btn btn-xs md:btn-sm btn-error text-white" onClick={() => {
                                        setSelectedWarehouse(warehouse);
                                        setIsDeleteModalOpen(true);
                                    }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={resetEditModal}>✕</button>
                        </form>
                        <h3 className="font-bold text-xl text-center">Edit Warehouse</h3>
                        <form className='flex flex-col gap-3 mt-5' onSubmit={handleEditSubmit}>
                            <label className="input input-bordered flex items-center gap-2">
                                <input type="text" className="grow" value={newWarehouseData.name} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, name: e.target.value })} />
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <input type="text" className="grow" value={newWarehouseData.location} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, location: e.target.value })} />
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <input type="text" className="grow" value={newWarehouseData.vat_no} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, vat_no: e.target.value })} />
                            </label>
                            <label className="input input-bordered flex items-center gap-2">
                                <input type="text" className="grow" value={newWarehouseData.cr_no} onChange={(e) => setNewWarehouseData({ ...newWarehouseData, cr_no: e.target.value })} />
                            </label>
                            <div className='text-center'>
                                <button className='btn bg-green-400 hover:bg-green-600 hover:text-white text-gray-800 font-bold'>
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Are you sure you want to delete this warehouse?</h3>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={() => handleDelete(selectedWarehouse.id)}>Yes</button>
                            <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default Warehouse;
