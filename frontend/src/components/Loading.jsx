import React from 'react';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
            <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                {/* Inner pulsing circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-teal-600/20 rounded-full animate-pulse"></div>
            </div>
            <p className="mt-4 text-teal-700 font-medium animate-pulse">Loading data...</p>
        </div>
    );
};

export default Loading;
