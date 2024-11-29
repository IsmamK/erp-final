import React, { useEffect, useState } from 'react';
import { FaStore, FaPlus } from 'react-icons/fa';

const Stores = ({ api }) => {
  const [stores, setStores] = useState([]);
  const [newStore, setNewStore] = useState({
    name: '',
    location: '',
    vat_no: '',
    cr_no: '',
    point_of_contact: '',
    whatsapp_number: '',
    email: ''
  });
  const [editStore, setEditStore] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null); // For delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control delete modal visibility

  // Fetch stores from API
  const fetchStores = async () => {
    const response = await fetch(`${api}/stores/`);
    const data = await response.json();
    setStores(data);
  };

  // Add a new store
  const addStore = async (e) => {
    e.preventDefault();
    const response = await fetch(`${api}/stores/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStore),
    });
    if (response.ok) {
      setNewStore({
        name: '',
        location: '',
        vat_no: '',
        cr_no: '',
        point_of_contact: '',
        whatsapp_number: '',
        email: ''
      });
      fetchStores(); // Refresh the list
      document.getElementById('my_modal_3').close();
    }
  };

  // Update a store
  const updateStore = async (e) => {
    e.preventDefault();
    const response = await fetch(`${api}/stores/${editStore.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editStore),
    });
    if (response.ok) {
      fetchStores(); // Refresh the list
      setIsEditing(false);
      setEditStore("");
      document.getElementById('edit_modal').close();
    }
  };

  // Delete a store
  const deleteStore = async (id) => {
    const response = await fetch(`${api}/stores/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchStores(); // Refresh the list
      setIsDeleteModalOpen(false); // Close the delete modal
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className='flex flex-col gap-10 dark:text-white dark:bg-black'>
      <h1 className='text-4xl md:text-7xl lg:text-8xl flex'>
        <FaStore className='mr-2' /> Stores
      </h1>

      {/* Add Store Button */}
      <div>
        <button className="btn bg-blue-800 hover:bg-blue-400 text-white" onClick={() => document.getElementById('my_modal_3').showModal()}>
          <FaPlus className='mr-4' /> Add Store
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-xl text-center">Add A New Store</h3>
            <form id="add-store" className='flex flex-col gap-3 mt-5' onSubmit={addStore}>
              {/* Input fields */}
              {Object.keys(newStore).map((key) => (
                <label className="input input-bordered flex items-center gap-2" key={key}>
                  <input type="text" className="grow" placeholder={key.replace(/_/g, ' ').toUpperCase()} value={newStore[key]} onChange={(e) => setNewStore({ ...newStore, [key]: e.target.value })} />
                </label>
              ))}
              <div className='text-center'>
                <button type="submit" className='btn bg-green-400 hover:bg-green-600 hover:text-white text-gray-800 font-bold'>
                  <FaPlus className='' /> ADD
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>

      <div className="overflow-x-scroll dark:bg-black w-[1000px]">
     


      <table className="table  table-xs dark:bg-gray-100 dark:text-white border-collapse text-xs overflow-x-scroll">
          <thead className="dark:bg-gray-100">
          <tr className="dark:bg-gray-100 dark:text-black">
<th>Inventory</th>
<th>Store Name</th>
<th>Store Location</th>
<th>VAT No.</th>
<th>CR No.</th>
<th>Point of Contact</th>
<th>Whatsapp Number</th>
<th>Email</th>
<th>QR Code</th> {/* New column for QR Code */}
<th>Actions</th>
</tr>

          </thead>
          <tbody>
            {stores.map((store) => (
              <tr  key={store.id} className="dark:bg-gray-600">
                <td>
<button className="btn btn-xs md:btn-sm btn-success text-white">Track Inventory</button>
</td>
                <td >{store.name} {store.last_name}</td>
                <td>{store.location}</td>
                <td>{store.vat_no}</td>
                <td>{store.cr_no}</td>
                <td>{store.point_of_contact}</td>
                <td>{store.whatsapp_number}</td>
                <td>{store.email}</td>
                <td className="dark:text-white">
              {/* QR Code Image */}
              <div className="flex flex-col items-center">
              <img src={store.qr_code_image} alt={`${store.name} QR Code`} className="w-12" />
              <a
              href={`${api}/download-qr-code/${store.id}/`} // Update to match your URL pattern
              className="mt-2 btn btn-xs btn-info text-white"
              >
              Download
              </a>
              </div>
              </td>

              <td className="flex gap-3 dark:text-white items-center">
              <button className="btn btn-warning btn-xs text-white" onClick={() => {
              setEditStore(store);
              setIsEditing(true);
              document.getElementById('edit_modal').showModal();
              }}>Edit</button>
              <dialog id="edit_modal" className="modal">
              <div className="modal-box">
              <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
              </form>
              <h1 className='font-bold text-2xl text-center'>Edit {store.name}</h1>
              <form id="edit-store" className='flex flex-col gap-3 mt-5' onSubmit={updateStore}>
              {/* Input fields */}
              {Object.keys(editStore).map((key) => (
              <label className="input input-bordered flex items-center gap-2" key={key}>
              <input type="text" className="grow" placeholder={key.replace(/_/g, ' ').toUpperCase()} value={editStore[key]} onChange={(e) => setEditStore({ ...editStore, [key]: e.target.value })} />
              </label>
              ))}
              <div className='text-center'>
              <button type="submit" className='btn bg-green-400 hover:bg-green-600 hover:text-white text-gray-800 font-bold'>
              Update
              </button>
              </div>
              </form>
              </div>
              </dialog>
              {/* You can open the modal using document.getElementById('ID').showModal() method */}
              <button className="btn btn-error btn-xs text-white" onClick={()=>document.getElementById('delete_modal').showModal()}>Delete</button>
              <dialog id="delete_modal" className="modal">
              <div className="modal-box">
              <h3 className="font-bold text-lg">Are you sure you want to delete this store?</h3>
              <div className="modal-action">
              <button className="btn btn-error" onClick={() => deleteStore(storeToDelete)}>Delete</button>
              <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              </div>
              </div>
              </dialog>
              </td>

                            
                            </tr>
                          ))}

                          
                        </tbody>
                      </table>
                  
                    </div>


                
                  </div>
                );
              };

export default Stores;
