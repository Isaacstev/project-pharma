import React, { useState } from 'react';
import { login, signUp } from '../api/authAPI';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

const AuthForm = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        role: 'Pharmacy',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isSignUp) {
                await signUp(formData);
                alert('Sign-up successful! Please log in.');
                setIsSignUp(false);
            } else {
                const { role, userId } = await login(formData.email, formData.password);
                localStorage.setItem('userId', userId);
                navigate(`/${role.toLowerCase()}-dashboard`);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isSignUp ? 'Sign Up' : 'Log In'}</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="auth-form">
                    {isSignUp && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Pharmacy">Pharmacy</option>
                                <option value="Wholesaler">Wholesaler</option>
                            </select>
                        </>
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit" className="auth-btn">
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                </form>
                <p className="toggle-text">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span className="toggle-link" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
