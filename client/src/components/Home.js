import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { FaClinicMedical, FaTruck } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();

    const handleAuth = (role) => {
        navigate(`/auth?role=${role}`);
    };

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1 className="hero-title">Welcome to Pharma Procurement System</h1>
                <p className="hero-subtitle">
                    Simplify your pharmaceutical procurement process and unlock a world of efficiency.
                </p>
            </div>

            <div className="benefits-section">
                <div className="benefit">
                    <FaClinicMedical className="benefit-icon" />
                    <h2>For Pharmacies</h2>
                    <p>Access a wide network of verified wholesalers with competitive pricing.</p>
                </div>
                <div className="benefit">
                    <FaTruck className="benefit-icon" />
                    <h2>For Wholesalers</h2>
                    <p>Connect with more pharmacies and streamline your order processing.</p>
                </div>
            </div>

            <div className="role-selection">
                <h3>Select Your Role</h3>
                <button className="role-btn" onClick={() => handleAuth('pharmacy')}>
                    Pharmacy
                </button>
                <button className="role-btn" onClick={() => handleAuth('wholesaler')}>
                    Wholesaler
                </button>
            </div>
        </div>
    );
};

export default Home;
