# React-PHP-MySQL Starter Kit

A modern, full-stack starter kit combining React frontend with PHP backend and MySQL database. Features role-based authentication, user management, and a clean, scalable architecture.

## 🏗️ Architecture Overview

### Frontend (React)
- **Framework**: React 18 with Vite for fast development
- **Routing**: React Router DOM for client-side navigation
- **State Management**: React Context API for authentication
- **HTTP Client**: Axios for API communication
- **UI Notifications**: SweetAlert2 for user feedback
- **Styling**: Vanilla CSS with modern design patterns

### Backend (PHP)
- **Language**: PHP 7.4+ with object-oriented approach
- **Database**: MySQL/MariaDB with both MySQLi and PDO connections
- **API Design**: RESTful endpoints with JSON responses
- **Security**: Password hashing, CORS handling, input validation
- **Architecture**: Modular structure with separate endpoints for different features

### Database Schema
- **users**: Core user authentication and role management
- **user_profiles**: Extended user information (first name, last name, phone, address)
- **settings**: Application configuration storage

## 🚀 How React and PHP Work Together

### 1. Authentication Flow
```
React Login Component → PHP auth/login.php → MySQL users table → JWT-like session → React Context
```

1. User submits credentials via React login form
2. React sends POST request to `API/auth/login.php`
3. PHP validates credentials against MySQL database
4. PHP returns user data and role information
5. React stores auth data in localStorage and Context
6. Protected routes check authentication status

### 2. API Communication Pattern
```javascript
// React Component
const response = await fetch(`${API_URL}user/profile.php`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(userData)
});
const result = await response.json();
```

```php
// PHP Endpoint
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);
// Process data...
echo json_encode(['status' => true, 'data' => $result]);
```

### 3. Role-Based Access Control
- **Frontend**: `ProtectedRoute` component checks user role before rendering
- **Backend**: Each PHP endpoint validates user permissions
- **Roles**: Admin (role='1') and User (role='3')

### 4. Data Flow Architecture
```
React Components ↔ AuthContext ↔ API Endpoints ↔ Database Layer ↔ MySQL
```

## 📁 Project Structure

```
react-php-mysql-starter/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── admin/               # Admin-only components
│   │   │   ├── AdminPanel.jsx   # Admin dashboard
│   │   │   └── Users.jsx        # User management
│   │   ├── auth/                # Authentication components
│   │   │   ├── Login.jsx        # Login form
│   │   │   └── Register.jsx     # Registration form
│   │   ├── shared/              # Shared components
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   └── user/                # User-specific components
│   │       └── Dashboard.jsx    # User dashboard
│   ├── contexts/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── App.jsx                  # Main app component with routing
│   ├── config.jsx               # API configuration
│   └── main.jsx                 # React entry point
├── API/                         # PHP Backend
│   ├── admin/                   # Admin endpoints
│   │   ├── users.php           # Get all users
│   │   └── update-user-role.php # Update user roles
│   ├── auth/                    # Authentication endpoints
│   │   ├── login.php           # User login
│   │   └── register.php        # User registration
│   ├── config/
│   │   └── database.php        # Database connection & CORS
│   ├── database/
│   │   └── starter_app.sql     # Database schema
│   └── user/                   # User endpoints
│       ├── profile.php         # Get user profile
│       ├── update-profile.php  # Update user profile
│       └── change-password.php # Change password
├── package.json                # Node.js dependencies
├── vite.config.js             # Vite configuration
└── index.html                 # HTML template
```

## 🛠️ Environment Setup

### Prerequisites
- **Node.js** 16+ and npm
- **PHP** 7.4+ with extensions: mysqli, pdo_mysql, json
- **MySQL** 5.7+ or **MariaDB** 10.3+
- **Web Server** (Apache, Nginx) or PHP built-in server

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd react-php-mysql-starter

# Install React dependencies
npm install
```

### Step 2: Database Setup

1. **Create Database**:
```sql
CREATE DATABASE starter_app CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. **Import Schema**:
```bash
mysql -u root -p starter_app < API/database/starter_app.sql
```

3. **Verify Tables**:
```sql
USE starter_app;
SHOW TABLES;
-- Should show: settings, users, user_profiles
```

### Step 3: Configure Database Connection

Edit `API/config/database.php`:
```php
define("DB_HOST", "localhost");
define("DB_USER", "your_mysql_username");
define("DB_PASS", "your_mysql_password");
define("DB_NAME", "starter_app");
```

### Step 4: Configure API URL

Edit `src/config.jsx`:
```javascript
// For development with PHP built-in server
const API_URL = 'http://localhost:8000/';

// For Apache/Nginx setup
const API_URL = 'http://localhost/your-project-path/API/';
```

### Step 5: Start Development Servers

**Option A: PHP Built-in Server (Recommended for Development)**
```bash
# Terminal 1: Start PHP server
cd API
php -S localhost:8000

# Terminal 2: Start React dev server
npm run dev
```

**Option B: Apache/Nginx Setup**
1. Copy project to web server directory (e.g., `/var/www/html/` or `C:\xampp\htdocs\`)
2. Update `src/config.jsx` with correct path
3. Start React dev server: `npm run dev`

### Step 6: Test the Application

1. **Access React App**: http://localhost:5173
2. **Test Login**:
   - Admin: `admin@example.com` / `admin123`
   - User: `user@example.com` / `user123`
3. **Test Registration**: Create a new account
4. **Test Role Access**: Try accessing `/admin` with different roles

## 🔧 API Endpoints

### Authentication
- `POST /auth/login.php` - User login
- `POST /auth/register.php` - User registration

### User Management
- `GET /user/profile.php` - Get user profile
- `POST /user/update-profile.php` - Update user profile
- `POST /user/change-password.php` - Change password

### Admin Only
- `GET /admin/users.php` - Get all users
- `POST /admin/update-user-role.php` - Update user role

## 🔐 Security Features

- **Password Hashing**: PHP `password_hash()` with bcrypt
- **CORS Protection**: Configured headers for cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Role-Based Access**: Frontend and backend role checking
- **SQL Injection Prevention**: Prepared statements with PDO/MySQLi

## 🎨 Customization Guide

### Adding New Features

1. **Create React Component**:
```jsx
// src/components/user/NewFeature.jsx
import React from 'react';

const NewFeature = () => {
  return <div>New Feature Content</div>;
};

export default NewFeature;
```

2. **Add Route**:
```jsx
// src/App.jsx
<Route path="/new-feature" element={
  <ProtectedRoute>
    <NewFeature />
  </ProtectedRoute>
} />
```

3. **Create PHP Endpoint**:
```php
// API/user/new-feature.php
<?php
require_once '../config/database.php';

header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

// Your logic here

echo json_encode(['status' => true, 'data' => $result]);
?>
```

### Styling Customization

Edit `src/index.css` to customize the appearance:
- CSS variables for consistent theming
- Responsive design patterns
- Modern CSS features (Grid, Flexbox)

## 🚨 Troubleshooting

### Common Issues

**CORS Errors**
- Verify CORS headers in `API/config/database.php`
- Check API URL in `src/config.jsx`
- Ensure web server allows required HTTP methods

**Database Connection Failed**
- Verify credentials in `API/config/database.php`
- Check MySQL service status
- Confirm database exists and user has permissions

**404 on API Calls**
- Verify API folder is web-accessible
- Check file permissions (755 for directories, 644 for files)
- Confirm web server PHP configuration

**Authentication Issues**
- Clear browser localStorage
- Check password hashing in database
- Verify user roles are correctly set

### Debug Mode

Enable PHP error reporting for development:
```php
// Add to top of API files
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

## 📈 Production Deployment

### Frontend Build
```bash
npm run build
# Deploy dist/ folder to web server
```

### Backend Configuration
- Remove debug error reporting
- Use environment variables for sensitive data
- Enable HTTPS
- Configure proper CORS origins
- Set up database connection pooling

### Security Checklist
- [ ] Change default passwords
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Configure proper CORS origins
- [ ] Use environment variables for secrets

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review browser console and PHP error logs
3. Verify all configuration files are properly set up
4. Ensure all dependencies are installed correctly

---

**Happy coding!** 🚀 This starter kit provides a solid foundation for building modern web applications with React and PHP.