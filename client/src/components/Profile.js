// src/components/Profile.js

import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import '../styles/Profile.css';  // Profile page styles

const Profile = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '0712345678',
    address: '',
    additionalContact: '',
    paymentMethod: 'mpesa',
    cardDetails: '',
    mpesaPhone: ''
  });
  const [location, setLocation] = useState({ lat: -1.286389, lng: 36.817223 });  // Default to Nairobi

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = ({ lat, lng }) => {
    setLocation({ lat, lng });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit updated user data here (API call or form processing)
    console.log('Profile updated:', formData, location);
  };

  return (
    <div className="profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* User Information */}
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
        </div>

        {/* Additional Contact Information */}
        <div className="form-group">
          <label>Additional Contact Information:</label>
          <input type="text" name="additionalContact" value={formData.additionalContact} onChange={handleInputChange} />
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        </div>

        {/* Location with Google Maps */}
        <div className="form-group">
          <label>Location:</label>
          <div className="map-container">
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'YOUR_GOOGLE_MAPS_API_KEY' }}
              center={location}
              defaultZoom={14}
              onClick={({ lat, lng }) => handleLocationChange({ lat, lng })}
            >
              <div lat={location.lat} lng={location.lng} className="location-pin">📍</div>
            </GoogleMapReact>
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-group">
          <label>Payment Method:</label>
          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange}>
            <option value="mpesa">M-Pesa</option>
            <option value="card">Card</option>
          </select>
        </div>

        {/* M-Pesa Phone */}
        {formData.paymentMethod === 'mpesa' && (
          <div className="form-group">
            <label>M-Pesa Phone Number:</label>
            <input type="tel" name="mpesaPhone" value={formData.mpesaPhone} onChange={handleInputChange} />
          </div>
        )}

        {/* Card Details */}
        {formData.paymentMethod === 'card' && (
          <div className="form-group">
            <label>Card Details:</label>
            <input type="text" name="cardDetails" placeholder="Card Number" value={formData.cardDetails} onChange={handleInputChange} />
          </div>
        )}

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
