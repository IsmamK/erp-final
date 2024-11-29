import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider,useNavigate } from "react-router-dom";
import Layout from './Layouts/Layout'
import Dashboard from  "./pages/Dashboard.jsx"
import Warehouse from  "./pages/Warehouse.jsx"
import Drivers from  "./pages/Drivers.jsx"
import Stores from  "./pages/Stores.jsx"
import Invoices from  "./pages/Invoices.jsx"
import Analytics from  "./pages/Analytics.jsx"
import AccountRoles from  "./pages/AccountRoles.jsx"
import Products from  "./pages/Products.jsx"
import DeliveryReturn from './pages/DeliveryReturn.jsx';
import axios from "axios"
import PrivateRoute from './components/PrivateRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';

axios.defaults.withCredentials = true;

import io from 'socket.io-client';
import WebSocketComponent from './components/WebSocketComponent.jsx';
import FCMComponent from './components/FCMComponent.jsx';
const SOCKET_SERVER_URL = 'ws://localhost:8000/ws/some_channel/';  // Replace with your WebSocket URL


if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js') // Register the Firebase service worker file
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}


const App = () => {

  const api = import.meta.env.VITE_API_URL;
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: '/',
      element: <PrivateRoute element={<Layout />} />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: 'websocket', element: <WebSocketComponent /> },
        { path: 'fcm', element: <FCMComponent /> },
        { path: 'dashboard', element: <Dashboard api={api}/>},

        { path: 'warehouse',
          
          children:[
          { path: '', element: <Warehouse api={api}/> },
          
         

        ] },

        { path: 'products',
          
          children:[
          { path: '', element: <Products api={api}/> },
          
         

        ] },
    

        { path: 'drivers',
          children:[
            { path: '', element: <Drivers api={api}/> },
           
  
          ]
          },
          { path: 'delivery-return',
            children:[
              { path: '', element: <DeliveryReturn api={api}/> },
             
    
            ]
            },

        { path: 'stores', 
          children:[
            { path: '', element: <Stores api={api}/> },
           
  
          ]
        },

        { path: 'invoices',  
          children:[
            { path: '', element: <Invoices api={api}/> },
           
  
          ]
        },

        { path: 'analytics', 
          children:[
            { path: '', element: <Analytics api={api}/> },
           
  
          ]
         },

        { path: 'account-roles', 
          children:[
            { path: '', element: <AccountRoles api={api}/> },
           
  
          ]
        },
      
      ],
    },

  ]);
  
  

  return <RouterProvider router={router} />;
};


export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

