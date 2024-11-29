import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { FaChartPie } from 'react-icons/fa'; // Import icons

const Analytics = ({api}) => {
    // State variables for the data
    const [totalSales, setTotalSales] = useState(0);
    const [totalDeliveries, setTotalDeliveries] = useState(0);
    const [totalInventory, setTotalInventory] = useState(0);
    const [totalReturns, setTotalReturns] = useState(0);
    const [profitAndLoss, setProfitAndLoss] = useState(0);
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const [monthlyDeliveriesData, setMonthlyDeliveriesData] = useState([]);
    const [monthlyProfitLossData, setMonthlyProfitLossData] = useState([]);

    // Example data for monthly trends (to be fetched from API)
    const exampleSalesData = [
        { month: 'Jan', sales: 5000, deliveries: 100, profitLoss: 1500 },
        { month: 'Feb', sales: 7000, deliveries: 150, profitLoss: 2500 },
        { month: 'Mar', sales: 6000, deliveries: 130, profitLoss: 2000 },
        { month: 'Apr', sales: 8000, deliveries: 200, profitLoss: 3000 },
        { month: 'May', sales: 9000, deliveries: 250, profitLoss: 3500 },
        { month: 'Jun', sales: 12000, deliveries: 300, profitLoss: 4500 },
    ];

    const fetchAnalyticsData = () => {
        // Simulate API fetch for totals and monthly trends
        const sales = 45000; // fetched from API
        const deliveries = 1130; // fetched from API
        const inventory = 1200; // fetched from API
        const returns = 50; // fetched from API
        const profitLoss = 15000; // fetched from API

        setTotalSales(sales);
        setTotalDeliveries(deliveries);
        setTotalInventory(inventory);
        setTotalReturns(returns);
        setProfitAndLoss(profitLoss);

        // Example monthly data for charts
        setMonthlySalesData(exampleSalesData.map(({ month, sales }) => ({ month, sales })));
        setMonthlyDeliveriesData(exampleSalesData.map(({ month, deliveries }) => ({ month, deliveries })));
        setMonthlyProfitLossData(exampleSalesData.map(({ month, profitLoss }) => ({ month, profitLoss })));
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    return (
        <div className="container mx-auto p-6" >
              <h1 className='text-4xl md:text-7xl lg:text-8xl flex mb-10 dark:text-white'>
        <FaChartPie className='mr-2' /> Analytics 
      </h1>
            
            {/* KPIs Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold">Total Sales</h2>
                    <p className="text-4xl font-bold text-blue-500">${totalSales}</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold">Total Deliveries</h2>
                    <p className="text-4xl font-bold text-green-500">{totalDeliveries}</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold">Total Inventory</h2>
                    <p className="text-4xl font-bold text-yellow-500">{totalInventory}</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold">Total Returns</h2>
                    <p className="text-4xl font-bold text-red-500">{totalReturns}</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold">Profit & Loss</h2>
                    <p className={`text-4xl font-bold ${profitAndLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {profitAndLoss >= 0 ? `+${profitAndLoss}` : profitAndLoss}
                    </p>
                </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">Monthly Sales Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlySalesData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Deliveries Chart */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-10">
                <h2 className="text-xl font-semibold mb-4">Monthly Deliveries</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyDeliveriesData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Bar dataKey="deliveries" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Profit & Loss Chart */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Monthly Profit & Loss</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyProfitLossData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="profitLoss" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
