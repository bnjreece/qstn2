import React from "react";

export default function AppIndex() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-3xl font-bold">Personal Plan</h1>
            <span className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Core Values</h2>
          <p className="text-sm text-gray-500 mb-4">(Fill in up to 5 of your strongest core values)</p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <input 
                  placeholder={`Value ${i}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Time Frame Sections */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Long-term Aspirations (10-25 years)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Relationships */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Relationships</h3>
              <textarea 
                placeholder="Your relationship aspirations..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={5}
              />
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Achievements</h3>
              <textarea 
                placeholder="Your achievement aspirations..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={5}
              />
            </div>

            {/* Rituals */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Rituals</h3>
              <textarea 
                placeholder="Your ritual aspirations..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={5}
              />
            </div>

            {/* Wealth */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Wealth (Experiences)</h3>
              <textarea 
                placeholder="Your wealth/experience aspirations..." 
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={5}
              />
            </div>
          </div>
        </div>

        {/* 1 Year Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">1 Year Activities</h2>
          <p className="text-sm text-gray-500 mb-4">(5 or less)</p>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i}>
                <input 
                  placeholder={`Activity ${i}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 90 Day Activities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* START Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">90 Day Activities - START</h2>
            <p className="text-sm text-gray-500 mb-4">(5 or less)</p>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <input 
                    placeholder={`Start Activity ${i}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* STOP Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-2">90 Day Activities - STOP</h2>
            <p className="text-sm text-gray-500 mb-4">(5 or less)</p>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <input 
                    placeholder={`Stop Activity ${i}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 