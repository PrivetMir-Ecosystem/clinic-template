<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$message = $input['message'] ?? '';
$sessionId = $input['session_id'] ?? 'default';

if (empty($message)) {
    echo json_encode(['response' => 'Пожалуйста, напишите ваш вопрос.', 'suggestions' => []]);
    exit;
}

// AI ожидает поле 'prompt', а не 'message'
$ch = curl_init('http://127.0.0.1:8000/ask');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'prompt' => $message,
    'session_id' => $sessionId
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    // Добавляем дисклеймер, если его нет
    $data = json_decode($response, true);
    if (is_array($data) && isset($data['response'])) {
        if (!str_contains($data['response'], 'не заменяют очную консультацию')) {
            $data['response'] .= "\n\n💡 Важно: мои рекомендации не заменяют очную консультацию стоматолога.";
        }
        echo json_encode($data);
    } else {
        echo $response;
    }
} else {
    echo json_encode([
        'response' => 'Извините, AI-помощник временно недоступен. Пожалуйста, свяжитесь с нами по телефону: +7 (47375) 46-461',
        'suggestions' => ['Записаться на приём', 'Узнать цены']
    ]);
}
