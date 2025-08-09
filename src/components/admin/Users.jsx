import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import Swal from 'sweetalert2';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 10;

  const roleOptions = [
    { value: '1', label: 'Admin' },
    { value: '3', label: 'User' }
  ];

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const authData = JSON.parse(localStorage.getItem('authData'));

      const response = await fetch(`${API_URL}admin/users.php?page=${currentPage}&limit=${usersPerPage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData?.user?.id}`
        }
      });

      const data = await response.json();
      console.log(data);

      if (data.status === 'success') {
        setUsers(data.users || []);
        setTotalUsers(data.total || 0);
        setTotalPages(Math.ceil((data.total || 0) / usersPerPage));
      } else {
        Swal.fire('Error', data.message || 'Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));

      const response = await fetch(`${API_URL}admin/update-user-role.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData?.user?.id}`
        },
        body: JSON.stringify({
          user_id: userId,
          role: newRole
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        Swal.fire('Success', 'User role updated successfully', 'success');
        fetchUsers(); // Refresh the list
      } else {
        Swal.fire('Error', data.message || 'Failed to update user role', 'error');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire('Error', 'Failed to update user role', 'error');
    }
  };

  const handleRoleChange = (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;

    const roleLabel = roleOptions.find(r => r.value === newRole)?.label;

    Swal.fire({
      title: 'Confirm Role Change',
      text: `Are you sure you want to change this user's role to ${roleLabel}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update role'
    }).then((result) => {
      if (result.isConfirmed) {
        updateUserRole(userId, newRole);
      }
    });
  };

  const getRoleLabel = (role) => {
    return roleOptions.find(r => r.value === role)?.label || 'Unknown';
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case '1': return 'badge bg-danger';
      case '3': return 'badge bg-primary';
      default: return 'badge bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">User Management</h4>
              <span className="badge bg-info">{totalUsers} Total Users</span>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No users found</p>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Email</th>
                          <th>Current Role</th>
                          <th>Change Role</th>
                          <th>Created At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={getRoleBadgeClass(user.role)}>
                                {getRoleLabel(user.role)}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm"
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, user.role, e.target.value)}
                                style={{ width: '140px' }}
                              >
                                {roleOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav aria-label="Users pagination" className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>

                        {[...Array(totalPages)].map((_, index) => {
                          const page = index + 1;
                          return (
                            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(page)}
                              >
                                {page}
                              </button>
                            </li>
                          );
                        })}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;