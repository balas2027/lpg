import React, { useState } from 'react';
import type { Report } from '../types';
import { Severity } from '../types';
import { MapComponent } from './MapComponent';

interface UserPageProps {
    reports: Report[]; 
    addReport: (report: Omit<Report, 'id' | 'timestamp' | 'userEmail' | 'status'>) => void;
}

export const UserPage: React.FC<UserPageProps> = ({ reports, addReport }) => {
    const [locationName, setLocationName] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [severity, setSeverity] = useState<Severity>(Severity.LOW);
    const [error, setError] = useState('');
    const [newReportPosition, setNewReportPosition] = useState<google.maps.LatLngLiteral | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);

        if (!locationName.trim()) {
            setError("Location name is required.");
            return;
        }
        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            setError("Please enter a valid latitude between -90 and 90.");
            return;
        }
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            setError("Please enter a valid longitude between -180 and 180.");
            return;
        }

        const position = { lat: latitude, lng: longitude };
        addReport({ locationName, position, severity });
        setNewReportPosition(position);

        setLocationName('');
        setLat('');
        setLng('');
        setSeverity(Severity.LOW);
        alert("Report submitted successfully! Thank you.");
    };

    const inputStyle = "block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors duration-200";

    return (
        <div className="w-full h-full relative">
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
            <div className="absolute top-4 left-4 p-4 sm:p-6 bg-gray-800/80 backdrop-blur-md rounded-lg shadow-2xl z-10 w-[calc(100%-2rem)] max-w-sm ring-1 ring-white/10 animate-fade-in">
                <h2 className="text-xl font-bold text-white mb-4">Report a New Leak</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="locationName" className="block text-sm font-medium text-gray-300">Location Name</label>
                        <input
                            id="locationName"
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g., Near Marina Beach"
                            className={inputStyle}
                            required
                        />
                    </div>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="latitude" className="block text-sm font-medium text-gray-300">Latitude</label>
                            <input
                                id="latitude"
                                type="number"
                                value={lat}
                                onChange={(e) => setLat(e.target.value)}
                                placeholder="13.0827"
                                className={inputStyle}
                                step="any"
                                required
                            />
                        </div>
                        <div className="flex-1">
                             <label htmlFor="longitude" className="block text-sm font-medium text-gray-300">Longitude</label>
                            <input
                                id="longitude"
                                type="number"
                                value={lng}
                                onChange={(e) => setLng(e.target.value)}
                                placeholder="80.2707"
                                className={inputStyle}
                                step="any"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="severity" className="block text-sm font-medium text-gray-300">Severity</label>
                        <select
                            id="severity"
                            value={severity}
                            onChange={(e) => setSeverity(e.target.value as Severity)}
                            className={inputStyle}
                        >
                            {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-transform transform hover:scale-105"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
            <MapComponent reports={reports} view="USER" centerOn={newReportPosition} />
        </div>
    );
};