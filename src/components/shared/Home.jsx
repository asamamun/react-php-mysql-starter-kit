import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Home = () => {
  const { authData, isAdmin, isUser } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="jumbotron bg-light p-5 rounded">
            <h1 className="display-4">Welcome to React-PHP-MySQL Starter Kit</h1>
            <p className="lead">
              A clean, production-ready boilerplate for building React applications 
              with PHP backend and MySQL database, featuring role-based authentication.
            </p>
            <hr className="my-4" />
            
            {!authData?.user ? (
              <div>
                <p>Get started by creating an account or logging in.</p>
                <Link className="btn btn-primary btn-lg me-3" to="/register">
                  Get Started
                </Link>
                <Link className="btn btn-outline-primary btn-lg" to="/login">
                  Login
                </Link>
              </div>
            ) : (
              <div>
                <p>Welcome back, {authData.user.username}!</p>
                <Link className="btn btn-primary btn-lg me-3" to="/dashboard">
                  Go to Dashboard
                </Link>
                {isAdmin() && (
                  <Link className="btn btn-warning btn-lg" to="/admin">
                    Admin Panel
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🚀 Fast Development</h5>
              <p className="card-text">
                Built with Vite for lightning-fast development and hot module replacement.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">🔐 Secure Authentication</h5>
              <p className="card-text">
                Role-based authentication with password hashing and protected routes.
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">📱 Responsive Design</h5>
              <p className="card-text">
                Bootstrap 5 integration for mobile-first, responsive user interfaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;