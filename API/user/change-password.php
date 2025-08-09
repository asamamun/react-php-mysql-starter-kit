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
    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }

    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['current_password']) || !isset($input['new_password'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Current password and new password are required']);
        exit;
    }

    $currentPassword = $input['current_password'];
    $newPassword = $input['new_password'];
    $confirmPassword = isset($input['confirm_password']) ? $input['confirm_password'] : '';

    // Validate input
    if (empty($currentPassword) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Passwords cannot be empty']);
        exit;
    }

    if (strlen($newPassword) < 6) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'New password must be at least 6 characters long']);
        exit;
    }

    if (!empty($confirmPassword) && $newPassword !== $confirmPassword) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'New password and confirmation do not match']);
        exit;
    }

    // Verify current password
    if (!password_verify($currentPassword, $user['password'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Current password is incorrect']);
        exit;
    }

    // Hash new password
    $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password
    $stmt = $pdo->prepare("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?");
    $result = $stmt->execute([$hashedNewPassword, $userId]);

    if ($result) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Password changed successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to change password']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>