# Setup Guide - React-PHP-MySQL Starter Kit

Follow these steps to get your starter kit up and running.

## Prerequisites

Make sure you have the following installed:
- **Node.js** (version 16 or higher)
- **PHP** (version 7.4 or higher)
- **MySQL** or **MariaDB**
- **Web server** (Apache, Nginx, or use PHP's built-in server)

## Step 1: Frontend Setup

1. Navigate to the starter-kit directory:
```bash
cd starter-kit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The React app will be available at `http://localhost:3000`

## Step 2: Database Setup

1. Create a new MySQL database:
```sql
CREATE DATABASE starter_app;
```

2. Import the database schema:
```bash
mysql -u root -p starter_app < database.sql
```

Or manually run the SQL commands from `database.sql` in your MySQL client.

## Step 3: Backend Configuration

1. Update database credentials in `API/config/database.php`:
```php
define("DB_HOST", "localhost");
define("DB_USER", "your_username");
define("DB_PASS", "your_password");
define("DB_NAME", "starter_app");
```

2. Update the API URL in `src/config.jsx` to match your server setup:
```javascript
const API_URL = 'http://localhost/starter-kit/API/';
```

## Step 4: Web Server Setup

### Option A: Using PHP Built-in Server (Development)
```bash
cd API
php -S localhost:8000
```
Then update `src/config.jsx`:
```javascript
const API_URL = 'http://localhost:8000/';
```

### Option B: Using Apache/Nginx
1. Copy the `starter-kit` folder to your web server directory
2. Ensure the API folder is accessible via HTTP
3. Update the API URL in `src/config.jsx` accordingly

## Step 5: Test the Application

1. Open `http://localhost:3000` in your browser
2. Try logging in with the default admin account:
   - **Email**: admin@example.com
   - **Password**: admin123

3. Test user registration by creating a new account
4. Verify role-based access by trying to access the admin panel

## Default Accounts

The database comes with these pre-configured accounts:

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Administrator

### User Account
- **Email**: user@example.com
- **Password**: user123
- **Role**: Regular User

## Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
1. The CORS headers are properly set in `API/config/database.php`
2. Your web server allows the necessary HTTP methods
3. The API URL in `src/config.jsx` is correct

### Database Connection Issues
1. Verify your database credentials in `API/config/database.php`
2. Ensure MySQL service is running
3. Check that the database `starter_app` exists
4. Verify the user has proper permissions

### 404 Errors on API Calls
1. Check that the API folder is accessible via HTTP
2. Verify the API URL in `src/config.jsx`
3. Ensure your web server is configured to handle PHP files

## Next Steps

Once everything is working:

1. **Customize the design** by modifying `src/index.css`
2. **Add new features** by creating components in the appropriate folders
3. **Extend the API** by adding new endpoints in the API folder
4. **Add more user roles** by modifying the database schema and components
5. **Implement additional security** measures like JWT tokens

## File Structure

```
starter-kit/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin-only components
│   │   ├── auth/           # Login/Register components
│   │   ├── shared/         # Shared components
│   │   └── user/           # User-specific components
│   ├── contexts/           # React contexts
│   └── config.jsx          # API configuration
├── API/
│   ├── admin/              # Admin endpoints
│   ├── auth/               # Authentication endpoints
│   └── config/             # Database configuration
├── database.sql            # Database schema
└── package.json            # Dependencies
```

## Support

If you encounter any issues:
1. Check the browser console for JavaScript errors
2. Check the PHP error logs for backend issues
3. Verify all configuration files are properly set up
4. Ensure all dependencies are installed

Happy coding! 🚀