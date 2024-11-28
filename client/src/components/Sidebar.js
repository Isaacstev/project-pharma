import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ type }) => {
    // Sidebar data for different types
    const sidebarData = {
        Pharmacy: {
            title: "Pharmacy Dashboard",
            links: [
                { path: '/pharmacy-dashboard', label: 'Inventory' },
                { path: '/orders', label: 'Orders' },
                { path: '/profile', label: 'Profile' },
                { path: '/settings', label: 'Settings' },
            ],
        },
        Wholesaler: {
            title: "Wholesaler Dashboard",
            links: [
                { path: '/wholesaler-dashboard', label: 'Inventory' },
                { path: '/orders', label: 'Orders' },
                { path: '/profile', label: 'Profile' },
                { path: '/settings', label: 'Settings' },
            ],
        },
    };

    // Default to Pharmacy if type is not specified
    const { title, links } = sidebarData[type] || sidebarData.Pharmacy;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>{title}</h2>
            </div>
            <ul className="sidebar-links">
                {links.map((link) => (
                    <li key={link.path}>
                        <NavLink
                            to={link.path}
                            className={({ isActive }) => (isActive ? 'active-link' : '')}
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
