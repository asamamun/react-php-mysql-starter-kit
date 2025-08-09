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

// Check if user is authenticated and is Admin (role = 1)
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader)) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authorization header missing']);
    exit;
}

$userId = str_replace('Bearer ', '', $authHeader);

try {
    // Verify user exists and has Admin role
    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user || $user['role'] !== '1') {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'Access denied. Admin role required.']);
        exit;
    }

    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['user_id']) || !isset($input['role'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'User ID and role are required']);
        exit;
    }

    $targetUserId = $input['user_id'];
    $newRole = $input['role'];

    // Validate role
    $validRoles = ['1', '3'];
    if (!in_array($newRole, $validRoles)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid role specified']);
        exit;
    }

    // Check if target user exists
    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE id = ?");
    $stmt->execute([$targetUserId]);
    $targetUser = $stmt->fetch();

    if (!$targetUser) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
        exit;
    }

    // Prevent Admin from changing their own role
    if ($targetUserId == $userId) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'You cannot change your own role']);
        exit;
    }

    // Update user role
    $stmt = $pdo->prepare("UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?");
    $result = $stmt->execute([$newRole, $targetUserId]);

    if ($result) {
        echo json_encode([
            'status' => 'success',
            'message' => 'User role updated successfully',
            'user_id' => $targetUserId,
            'new_role' => $newRole
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to update user role']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>