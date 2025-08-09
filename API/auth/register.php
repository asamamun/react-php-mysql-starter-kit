<?php
require_once '../config/database.php';

// Get the request data
$requestData = json_decode(file_get_contents('php://input'), true);

if (!$requestData || !isset($requestData['username']) || !isset($requestData['email']) || !isset($requestData['password'])) {
    echo json_encode([
        'status' => false,
        'error' => 'Username, email, and password are required'
    ]);
    exit;
}

$username = trim($requestData['username']);
$email = trim($requestData['email']);
$password = $requestData['password'];
$role = '3'; // Default role is user (3)

// Validate input
if (empty($username) || empty($email) || empty($password)) {
    echo json_encode([
        'status' => false,
        'error' => 'All fields are required'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'status' => false,
        'error' => 'Invalid email format'
    ]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode([
        'status' => false,
        'error' => 'Password must be at least 6 characters long'
    ]);
    exit;
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'status' => false,
        'error' => 'Email already exists'
    ]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $username, $email, $hashedPassword, $role);

if ($stmt->execute()) {
    echo json_encode([
        'status' => true,
        'message' => 'Registration successful'
    ]);
} else {
    echo json_encode([
        'status' => false,
        'error' => 'Registration failed. Please try again.'
    ]);
}

$stmt->close();
$conn->close();
?>