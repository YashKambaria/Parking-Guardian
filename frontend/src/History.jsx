import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function History({ darkMode, historyData }) {
  const data = historyData || [
    { 
      plateNo: "ABC-1234", 
      carModel: "Tesla Model 3", 
      timestamp: "2025/02/26 10:00 AM", 
      type: "SMS", 
      location: "https://maps.google.com/?q=37.7749,-122.4194",
      from: "Yashk"
    },
    { 
      plateNo: "ABC-1234", 
      carModel: "Tesla Model 3", 
      timestamp: "2025/02/26 10:00 AM", 
      type: "SMS", 
      location: "https://maps.google.com/?q=37.7749,-122.4194",
      from: "Yashk"
    },
    { 
      plateNo: "ABC-1234", 
      carModel: "Tesla Model 3", 
      timestamp: "2025/02/26 10:00 AM", 
      type: "SMS", 
      location: "https://maps.google.com/?q=37.7749,-122.4194",
      from: "Yashk"
    },
  ];

  // Track which maps have been initialized
  const [mapsInitialized, setMapsInitialized] = useState({});
  // Store map instances
  const mapInstancesRef = useRef({});

  // Function to extract coordinates from Google Maps URL
  const getCoordinates = (url) => {
    const match = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    return match ? [parseFloat(match[1]), parseFloat(match[2])] : [0, 0];
  };

  // Function to initialize a map when its container is ready
  const initializeMap = (element, id, location) => {
    if (!element || mapsInitialized[id]) return;

    // Clean up existing instance if it exists
    if (mapInstancesRef.current[id]) {
      mapInstancesRef.current[id].remove();
    }

    const [lat, lng] = getCoordinates(location);
    
    try {
      // Create new map instance
      const map = L.map(element).setView([lat, lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      L.marker([lat, lng]).addTo(map);
      
      // Store the map instance
      mapInstancesRef.current[id] = map;
      
      // Update initialization state
      setMapsInitialized(prev => ({...prev, [id]: true}));
    } catch (error) {
      console.error(`Error initializing map ${id}:`, error);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      Object.values(mapInstancesRef.current).forEach(map => {
        if (map) {
          map.remove();
        }
      });
      mapInstancesRef.current = {};
    };
  }, []);

  return (
    <div className="history-container mt-18 ml-[250px]">
      <h2 className="text-2xl font-bold my-4">History</h2>
      
      <div className="space-y-6 flex flex-wrap">
        {data.map((entry, index) => {
          const mapId = `map-${index}`;
          
          return (
            <div key={mapId} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mx-3 w-90 ml-7 mb-7">
              {/* Content Section */}
              <div className="p-4">
                <h3 className="text-4xl font-semibold mb-2">
                  {entry.carModel}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Complaint by: {entry.from}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Plate No: {entry.plateNo}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Reported on: {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Type: {entry.type}
                </p>
              </div>
            
              {/* Map Section */}
              <div className="p-4 pt-0 relative z-1">
                {entry.location ? (
                  <div 
                    ref={(el) => el && !mapsInitialized[mapId] && initializeMap(el, mapId, entry.location)}
                    className="w-full h-[200px] border-0 rounded-lg shadow-lg"
                  />
                ) : (
                  <div className="w-full h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    Loading map...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}