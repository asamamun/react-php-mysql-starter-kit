<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

require_once '../config/database.php';

// Check if user is authenticated
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authorization header missing']);
    exit;
}

$userId = str_replace('Bearer ', '', $authHeader);

try {
    // Verify user exists
    $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }

    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['username']) || !isset($input['email'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Username and email are required']);
        exit;
    }

    $newUsername = trim($input['username']);
    $newEmail = trim($input['email']);
    $firstName = isset($input['first_name']) ? trim($input['first_name']) : '';
    $lastName = isset($input['last_name']) ? trim($input['last_name']) : '';
    $phone = isset($input['phone']) ? trim($input['phone']) : '';
    $address = isset($input['address']) ? trim($input['address']) : '';

    // Validate input
    if (empty($newUsername) || empty($newEmail)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Username and email cannot be empty']);
        exit;
    }

    if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        exit;
    }

    // Check if email is already taken by another user
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->execute([$newEmail, $userId]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email is already taken']);
        exit;
    }

    // Start transaction
    $pdo->beginTransaction();

    try {
        // Update user basic info
        $stmt = $pdo->prepare("UPDATE users SET username = ?, email = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newUsername, $newEmail, $userId]);

        // Check if user profile exists
        $stmt = $pdo->prepare("SELECT id FROM user_profiles WHERE user_id = ?");
        $stmt->execute([$userId]);
        $profileExists = $stmt->fetch();

        if ($profileExists) {
            // Update existing profile
            $stmt = $pdo->prepare("UPDATE user_profiles SET first_name = ?, last_name = ?, phone = ?, address = ?, updated_at = NOW() WHERE user_id = ?");
            $stmt->execute([$firstName, $lastName, $phone, $address, $userId]);
        } else {
            // Create new profile
            $stmt = $pdo->prepare("INSERT INTO user_profiles (user_id, first_name, last_name, phone, address) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $firstName, $lastName, $phone, $address]);
        }

        // Get updated user data with profile
        $stmt = $pdo->prepare("
            SELECT u.id, u.username, u.email, u.role, u.created_at,
                   p.first_name, p.last_name, p.phone, p.address
            FROM users u 
            LEFT JOIN user_profiles p ON u.id = p.user_id 
            WHERE u.id = ?
        ");
        $stmt->execute([$userId]);
        $updatedUser = $stmt->fetch();

        $pdo->commit();

        echo json_encode([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'user' => $updatedUser
        ]);

    } catch (Exception $e) {
        $pdo->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to update profile: ' . $e->getMessage()]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>