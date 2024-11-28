import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';

const Profile = ({ userId }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error.message);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async () => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profile),
            });
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error.message);
            alert('Failed to update profile.');
        }
    };

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            <div className="profile-form">
                <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="Name"
                />
                <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                />
                <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    placeholder="Address"
                />
                <button onClick={handleUpdateProfile}>Update Profile</button>
            </div>
        </div>
    );
};

export default Profile;
