import React from 'react';
import { useAppsContext } from '@contexts/apps-context';

const Navbar = () => {
    const { openApps, removeApp } = useAppsContext();

    return (
        <nav className="w-full">
            <ul className="">
                {openApps.map((app) => (
                    <li key={app.instanceId} className="flex items-center justify-between p-2 bg-gray-800 hover:bg-gray-700 rounded-md m-2">
                        <span className="text-white">{app.name}</span>
                        <button className="text-red-500" onClick={() => removeApp(app.instanceId)}>Close</button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;