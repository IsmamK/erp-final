import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Manually specify the driver ID for testing
const DRIVER_ID = 23;  // Replace with actual driver ID
const SOCKET_SERVER_URL = 'ws://localhost:8000/ws/driver/';  // Adjust your WebSocket URL

const WebSocketComponent = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [pickups, setPickups] = useState([]);
    const [fcmToken, setFcmToken] = useState('');
    const [location, setLocation] = useState({ latitude: '', longitude: '' });

    // Initialize WebSocket connection
    useEffect(() => {
        const ws = new WebSocket(`${SOCKET_SERVER_URL}${DRIVER_ID}/`);  // Connect to driver-specific WebSocket group
        setSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connected!');
            setIsConnected(true);
        };

        // Listen for pickup notifications
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setPickups((prevPickups) => [...prevPickups, data]);  // Correctly append new pickup data
            console.log('New pickup received:', data);

            // Check if it's for the specific driver and show toast
            if (data.driver_id === DRIVER_ID) {
                toast.success(`New pickup created for driver ${DRIVER_ID}: ${data.pickup_id}`);
            }
        };

        // Handle WebSocket disconnection
        ws.onclose = () => {
            console.log('WebSocket disconnected!');
            setIsConnected(false);
        };

        // Cleanup WebSocket connection on component unmount
        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    // Function to send location updates to WebSocket
    const sendLocationUpdate = () => {
        if (socket && location.latitude && location.longitude) {
            const locationData = {
                location: {
                    latitude: parseFloat(location.latitude),
                    longitude: parseFloat(location.longitude),
                },
            };
            socket.send(JSON.stringify(locationData));  // Send location data via WebSocket
            toast.info('Location update sent!');
        } else {
            toast.error('Please provide valid location coordinates.');
        }
    };

    // Simulate sending a pickup notification (for testing purposes)
    const sendPickupNotification = () => {
        if (socket && fcmToken) {
            const pickupData = {
                pickup: {
                    pickup_id: Math.floor(Math.random() * 1000),  // Generate random pickup ID
                    details: 'New pickup assigned!',  // Example pickup message
                },
                fcm_token: fcmToken,
            };
            socket.send(JSON.stringify(pickupData));  // Send pickup notification via WebSocket
            toast.info('Pickup notification sent!');
        } else {
            toast.error('FCM Token is missing!');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-3xl font-semibold text-center text-blue-600">WebSocket and Firebase Notification Testing</h1>
            <p className="text-center mt-2">{isConnected ? 'Connected' : 'Disconnected'}</p>

            {/* Toast Container to display notifications */}
            <ToastContainer />

            <div className="mt-8">
                <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Location Update</h2>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Latitude:</label>
                            <input
                                type="text"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                value={location.latitude}
                                onChange={(e) => setLocation({ ...location, latitude: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Longitude:</label>
                            <input
                                type="text"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                value={location.longitude}
                                onChange={(e) => setLocation({ ...location, longitude: e.target.value })}
                            />
                        </div>
                        <button
                            onClick={sendLocationUpdate}
                            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                        >
                            Send Location Update
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Pickup Notification</h2>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">FCM Token:</label>
                            <input
                                type="text"
                                className="mt-1 p-2 border border-gray-300 rounded-md"
                                value={fcmToken}
                                onChange={(e) => setFcmToken(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={sendPickupNotification}
                            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                        >
                            Send Pickup Notification
                        </button>
                    </div>
                </div>
            </div>

            <div className="pickup-list mt-10">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Received Pickup Notifications</h2>
                <ul className="space-y-4">
                    {pickups.map((pickup, index) => (
                        <li key={index} className="p-4 bg-white shadow-md rounded-md">
                            <strong className="block text-lg font-medium">{pickup.message}</strong>
                        
                            {/* Add other pickup details here */}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebSocketComponent;
