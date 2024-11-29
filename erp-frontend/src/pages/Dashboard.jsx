import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ExclamationCircleIcon, BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
const Dashboard = ({api}) => {
  const [deliveryCount, setDeliveryCount] = useState(0);
  const targetCount = 341; 
  const [pendingCount, setPendingCount] = useState(50);
  const [deliveredCount, setDeliveredCount] = useState(290);
  const [returnedCount, setReturnedCount] = useState(51);

  const [revenueCount, setRevenueCount] = useState(0);
  const targetRevenue = 100000; 
  const [cashRevenue, setCashRevenue] = useState(400);
  const [posRevenue, setPosRevenue] = useState(600);

  // Data for deliveries and revenues for the current and previous month

 // Current month revenue data
 const currentCashRevenue = 12000; // Example value for current month cash revenue
 const currentPosRevenue = 10000; // Example value for current month POS revenue

 // Previous month revenue data
 const previousCashRevenue = 10000; // Example value for previous month cash revenue
 const previousPosRevenue = 8000; // Example value for previous month POS revenue

 // Data for deliveries comparison over the last two months
 const deliveryData = [
   { week: 'Week 1', currentDelivered: 120, currentReturned: 6, previousDelivered: 100, previousReturned: 5 },
   { week: 'Week 2', currentDelivered: 160, currentReturned: 7, previousDelivered: 150, previousReturned: 8 },
   { week: 'Week 3', currentDelivered: 130, currentReturned: 5, previousDelivered: 120, previousReturned: 4 },
   { week: 'Week 4', currentDelivered: 180, currentReturned: 8, previousDelivered: 170, previousReturned: 10 },
   { week: 'Week 5', currentDelivered: 210, currentReturned: 5, previousDelivered: 200, previousReturned: 6 },
 ];

 // Data for revenue comparison (Cash vs. POS for this month and last month)
 const revenueData = [
    { week: 'Week 1', cash: 2000, pos: 1500, lastMonthCash: 1800, lastMonthPos: 1200 },
    { week: 'Week 2', cash: 2500, pos: 1800, lastMonthCash: 2200, lastMonthPos: 1400 },
    { week: 'Week 3', cash: 3000, pos: 2300, lastMonthCash: 2800, lastMonthPos: 2000 },
    { week: 'Week 4', cash: 3500, pos: 2900, lastMonthCash: 3200, lastMonthPos: 2700 },
  ];



  useEffect(() => {
    const incrementSpeed = 1;
    const incrementStep = 5;

    const interval = setInterval(() => {
      setDeliveryCount(prevCount => {
        if (prevCount >= targetCount) {
          clearInterval(interval);
          return targetCount;
        }
        return prevCount + incrementStep;
      });
    }, incrementSpeed);

    return () => clearInterval(interval);
  }, [targetCount]);

  useEffect(() => {
    const incrementSpeed = 1;
    const incrementStep = 2000;

    const interval = setInterval(() => {
      setRevenueCount(prevRevenue => {
        if (prevRevenue >= targetRevenue) {
          clearInterval(interval);
          return targetRevenue;
        }
        return prevRevenue + incrementStep;
      });
    }, incrementSpeed);

    return () => clearInterval(interval);
  }, [targetRevenue]);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 items-center justify-center gap-20 grid-rows-2 space-between dark:text-black'>

         {/* Revenue Chart */}
      <div className="card md:col-span-2 lg:col-span-3 bg-base-100 shadow-xl  h-[500px] mb-10">
        <div className="card-body">
          <h2 className="card-title">Revenue Comparison (This Month vs. Last Month)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Thick curves for revenue trends */}
              <Line type="monotone" dataKey="cash" stroke="#82ca9d" strokeWidth={4} name="This Month Cash" animationDuration={2000} isAnimationActive={true} />
              <Line type="monotone" dataKey="lastMonthCash" stroke="#007acc" strokeWidth={4} name="Last Month Cash" animationDuration={2000}                 isAnimationActive={true} />
              <Line type="monotone" dataKey="pos" stroke="#ff7300" strokeWidth={4} name="This Month POS" animationDuration={2000}                 isAnimationActive={true} />
              <Line type="monotone" dataKey="lastMonthPos" stroke="#ffcc00" strokeWidth={4} name="Last Month POS" animationDuration={2000}                 isAnimationActive={true} />
            
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

   {/* Revenues Collected CARD Section */}
   <div className="card bg-base-100 h-[500px] shadow-xl md:col-span-2 w-full lg:col-span-2" >
        <div className="card-body ">
          <h2 className="card-title">Revenues Collected:</h2>
          <p className='font-bold text-2xl'>SR</p>
          <div className="flex items-center gap-3">
            <h1 className='text-3xl md:text-4xl lg:text-8xl font-bold'>{revenueCount}</h1>
            <ArrowUpIcon className='h-8 w-8 text-green-500' />
          </div>
          <p className='text-gray-400 font-bold'>This month</p>
          <div className="flex justify-between mt-4">
            <div className="flex items-center gap-1">
              <BanknotesIcon className='h-6 w-6 text-green-500' />
              <span className='font-bold'>CASH: SR {cashRevenue}</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCardIcon className='h-6 w-6 text-blue-500' />
              <span className='font-bold'>POS: SR {posRevenue}</span>
            </div>
          </div>
        </div>
      </div>
    
         {/* Delivery Chart */}
      <div className="card md:col-span-2 lg:col-span-3 bg-base-100 shadow-xl w-full  h-[500px]">
        <div className="card-body">
          <h2 className="card-title">Delivery Comparison (Delivered vs. Returned)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deliveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Current Month Stacked Bar for Delivered and Returned */}
              <Bar dataKey="currentDelivered" stackId="a" fill="#82ca9d" name="Current Month Delivered" />
              <Bar dataKey="currentReturned" stackId="a" fill="#ff7300" name="Current Month Returned" />
              {/* Previous Month Stacked Bar for Delivered and Returned */}
              <Bar dataKey="previousDelivered" stackId="b" fill="#61dafb" name="Previous Month Delivered" />
              <Bar dataKey="previousReturned" stackId="b" fill="#ff8c00" name="Previous Month Returned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

           {/* Delivery Summary CARD Section */}
           <div className="card bg-base-100 h-[500px] shadow-xl lg:col-span-2 md:col-span-2">
        <div className="card-body gap-6">
          <h2 className="card-title">Deliveries:</h2>
          <div className="flex items-center gap-3">
            <h1 className='text-9xl md:text-6xl lg:text-9xl'>{deliveryCount}</h1>
            <ArrowUpIcon className='h-12 w-12 text-green-500' />
          </div>
          <p className='text-gray-400 font-bold'>This month</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <ExclamationCircleIcon className='h-6 w-6 text-yellow-500' />
              <span className='font-bold'>{pendingCount} Pending </span>
            </div>
          </div>
        </div>
      </div>


      
   
   

   
      </div>


  );
};

export default Dashboard;
