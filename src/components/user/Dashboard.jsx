import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import API_URL from '../../config';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const { authData, isAdmin, setAuthData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    username: authData?.user?.username || '',
    email: authData?.user?.email || '',
    first_name: authData?.user?.first_name || '',
    last_name: authData?.user?.last_name || '',
    phone: authData?.user?.phone || '',
    address: authData?.user?.address || ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}user/update-profile.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData?.user?.id}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Update auth context with new user data
        const updatedAuthData = {
          ...authData,
          user: data.user
        };
        setAuthData(updatedAuthData);
        localStorage.setItem('authData', JSON.stringify(updatedAuthData));
        
        setShowProfileModal(false);
        Swal.fire('Success', 'Profile updated successfully', 'success');
      } else {
        Swal.fire('Error', data.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire('Error', 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}user/change-password.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData?.user?.id}`
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setShowPasswordModal(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        Swal.fire('Success', 'Password changed successfully', 'success');
      } else {
        Swal.fire('Error', data.message || 'Failed to change password', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      Swal.fire('Error', 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openProfileModal = async () => {
    // Fetch latest profile data including extended fields
    try {
      const response = await fetch(`${API_URL}user/profile.php`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData?.user?.id}`
        }
      });

      const data = await response.json();
      if (data.status === 'success') {
        setProfileData({
          username: data.user.username || '',
          email: data.user.email || '',
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        });
      } else {
        // Fallback to current auth data
        setProfileData({
          username: authData?.user?.username || '',
          email: authData?.user?.email || '',
          first_name: authData?.user?.first_name || '',
          last_name: authData?.user?.last_name || '',
          phone: authData?.user?.phone || '',
          address: authData?.user?.address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to current auth data
      setProfileData({
        username: authData?.user?.username || '',
        email: authData?.user?.email || '',
        first_name: authData?.user?.first_name || '',
        last_name: authData?.user?.last_name || '',
        phone: authData?.user?.phone || '',
        address: authData?.user?.address || ''
      });
    }
    setShowProfileModal(true);
  };

  const openPasswordModal = () => {
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setShowPasswordModal(true);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2>Dashboard</h2>
          <p className="text-muted">Welcome to your personal dashboard</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">User Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <strong>Username:</strong>
                </div>
                <div className="col-sm-9">
                  {authData?.user?.username}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <strong>Email:</strong>
                </div>
                <div className="col-sm-9">
                  {authData?.user?.email}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <strong>Full Name:</strong>
                </div>
                <div className="col-sm-9">
                  {authData?.user?.first_name || authData?.user?.last_name 
                    ? `${authData?.user?.first_name || ''} ${authData?.user?.last_name || ''}`.trim()
                    : 'Not provided'
                  }
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <strong>Phone:</strong>
                </div>
                <div className="col-sm-9">
                  {authData?.user?.phone || 'Not provided'}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <strong>Address:</strong>
                </div>
                <div className="col-sm-9">
                  {authData?.user?.address || 'Not provided'}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <strong>Role:</strong>
                </div>
                <div className="col-sm-9">
                  <span className={`badge ${authData?.user?.role === '1' ? 'bg-danger' : 'bg-primary'}`}>
                    {authData?.user?.role === '1' ? 'Administrator' : 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-primary" 
                  type="button"
                  onClick={openProfileModal}
                >
                  Update Profile
                </button>
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={openPasswordModal}
                >
                  Change Password
                </button>
                {isAdmin() && (
                  <button 
                    className="btn btn-outline-warning" 
                    type="button"
                    onClick={() => navigate('/admin')}
                  >
                    Admin Panel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <p className="text-muted">No recent activity to display.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {showProfileModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Profile</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowProfileModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateProfile}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          value={profileData.username}
                          onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="first_name"
                          value={profileData.first_name}
                          onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="last_name"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      id="address"
                      rows="3"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowProfileModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPasswordModal(false)}
                ></button>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="current_password" className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="current_password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="new_password" className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="new_password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      minLength="6"
                      required
                    />
                    <div className="form-text">Password must be at least 6 characters long.</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirm_password" className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      required
                    />
                    {passwordData.new_password && passwordData.confirm_password && 
                     passwordData.new_password !== passwordData.confirm_password && (
                      <div className="text-danger small mt-1">Passwords do not match</div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading || (passwordData.new_password !== passwordData.confirm_password)}
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;