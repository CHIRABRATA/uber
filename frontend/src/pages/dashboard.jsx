import React, { useState } from 'react';

const Dashboard = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching rides for:', pickup, 'to', destination);
    };

    return (
        <div className="h-screen w-screen relative overflow-hidden bg-gray-100">
            {/* Map Placeholder Image */}
            <div className="absolute inset-0">
                {/* Temporary placeholder map. You can integrate Google Maps or Mapbox later */}
                <img 
                    className="h-full w-full object-cover opacity-80" 
                    src="https://simonpan.com/wp-content/themes/sp_portfolio/assets/uber-rider-app-map.jpg" 
                    alt="Map view" 
                />
            </div>

            {/* Top Menu Icon */}
            <div className="absolute top-0 left-0 p-5 flex justify-between w-full z-10">
                <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Bottom Sheet - Find a trip */}
            <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl pt-6 pb-8 px-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Find a trip</h2>
                
                <form onSubmit={handleSearch} className="flex flex-col gap-4 relative">
                    {/* Connecting line between inputs */}
                    <div className="absolute left-[18px] top-[28px] bottom-[32px] w-[2px] bg-gray-300 z-0 hidden md:block"></div>
                    <div className="absolute left-[18px] top-[30px] bottom-[108px] w-[2px] bg-[#000000] z-0"></div>

                    {/* Pickup Input */}
                    <div className="relative z-10 flex items-center bg-[#eee] rounded-lg p-3">
                        <div className="w-2 h-2 rounded-full bg-black mr-4 ml-1"></div>
                        <input 
                            type="text" 
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            placeholder="Add a pick-up location" 
                            className="bg-transparent w-full outline-none text-base"
                            required
                        />
                    </div>
                    
                    {/* Destination Input */}
                    <div className="relative z-10 flex items-center bg-[#eee] rounded-lg p-3 mt-1">
                        <div className="w-2 h-2 bg-black mr-4 ml-1 rounded-sm"></div>
                        <input 
                            type="text" 
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Enter your destination" 
                            className="bg-transparent w-full outline-none text-base"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-black text-white py-3 mt-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition">
                        Search rides
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Dashboard;
