import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../config';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      const response = await axios.get(`${API_URL}admin/users.php`, {
        headers: {
          'Authorization': `Bearer ${authData?.user?.id}`
        }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load users',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      await axios.post(`${API_URL}admin/update-user-role.php`, {
        user_id: userId,
        role: newRole
      }, {
        headers: {
          'Authorization': `Bearer ${authData?.user?.id}`,
          'Content-Type': 'application/json'
        }
      });
      
      Swal.fire({
        title: 'Success',
        text: 'User role updated successfully',
        icon: 'success'
      });
      
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update user role',
        icon: 'error'
      });
    }
  };



  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h2>Admin Panel</h2>
          <p className="text-muted">Manage users and system settings</p>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">User Management</h5>
              <button 
                className="btn btn-primary btn-sm"
                onClick={fetchUsers}
              >
                Refresh
              </button>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <p className="text-muted">No users found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role === '1' ? 'bg-danger' : 'bg-primary'}`}>
                              {user.role === '1' ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => updateUserRole(user.id, user.role === '1' ? '3' : '1')}
                            >
                              {user.role === '1' ? 'Make User' : 'Make Admin'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Total Users</h5>
              <h2 className="text-primary">{users.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Admins</h5>
              <h2 className="text-danger">{users.filter(u => u.role === '1').length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Regular Users</h5>
              <h2 className="text-success">{users.filter(u => u.role === '3').length}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;