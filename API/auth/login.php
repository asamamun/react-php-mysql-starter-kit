<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once '../config/database.php';

// Get the request data
$requestData = json_decode(file_get_contents('php://input'), true);

if (!$requestData || !isset($requestData['email']) || !isset($requestData['password'])) {
    echo json_encode([
        'status' => false,
        'message' => 'Email and password are required',
        'user' => null
    ]);
    exit;
}

$email = $requestData['email'];
$password = $requestData['password'];

try {
    // Get user with profile data
    $stmt = $pdo->prepare("
        SELECT u.id, u.username, u.email, u.password, u.role, u.created_at,
               p.first_name, p.last_name, p.phone, p.address
        FROM users u 
        LEFT JOIN user_profiles p ON u.id = p.user_id 
        WHERE u.email = ? 
        LIMIT 1
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        // Verify password
        if (password_verify($password, $user['password'])) {
            // Remove password from response
            unset($user['password']);
            
            $response = [
                'status' => true,
                'message' => 'Login successful',
                'user' => $user
            ];
        } else {
            $response = [
                'status' => false,
                'message' => 'Invalid credentials',
                'user' => null
            ];
        }
    } else {
        $response = [
            'status' => false,
            'message' => 'User not found',
            'user' => null
        ];
    }

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => false,
        'message' => 'Database error: ' . $e->getMessage(),
        'user' => null
    ]);
}
?>