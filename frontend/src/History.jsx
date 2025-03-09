import React from "react";

export default function History({ darkMode, historyData }) {
  const data = historyData || [
    { 
      id: 1, 
      person: "John Doe", 
      plateNo: "ABC-1234", 
      carModel: "Tesla Model 3", 
      timestamp: "2025/02/26 10:00 AM", 
      complaintType: "SMS", 
      location: "https://maps.google.com/?q=37.7749,-122.4194" 
    },
    { 
      id: 2, 
      person: "Jane Smith", 
      plateNo: "XYZ-5678", 
      carModel: "Ford Mustang", 
      timestamp: "2025-02-25 3:45 PM", 
      complaintType: "Call", 
      location: "https://maps.google.com/?q=40.7128,-74.0060" 
    },
    { 
      id: 3, 
      person: "Alice Johnson", 
      plateNo: "LMN-9101", 
      carModel: "BMW X5", 
      timestamp: "2025-02-24 8:30 AM", 
      complaintType: "SMS", 
      location: "https://maps.google.com/?q=34.0522,-118.2437" 
    }
  ];

  return (
    <div className={`flex-1 mt-18 p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-semibold mb-4">History</h2>
      <div className="space-y-4">
        {data.map((entry) => (
          <div 
            key={entry.id} 
            className={`p-4 rounded-lg shadow-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <h3 className="text-xl font-semibold">{entry.carModel}</h3>
            <p className="text-md">
              <span className="font-semibold">Complaint by: </span>{entry.from}
            </p>
            <p className="text-md">
              <span className="font-semibold">Plate No: </span>{entry.plateNo}
            </p>
            <p className="text-md">
              <span className="font-semibold">Reported on: </span>{new Date(entry.timestamp).toLocaleString()}
            </p>
            <p className="text-md">
              <span className="font-semibold">Type: </span>{entry.type}
            </p>
            <p className="text-md">
              <span className="font-semibold">Location: </span>
              <a 
                href={entry.location} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 underline"
              >
                View on Map
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
