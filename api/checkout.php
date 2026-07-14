<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || empty($data['customer']) || empty($data['items'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Некорректные данные заказа']);
    exit;
}

$pdo->beginTransaction();
try {
    // Создаём заказ — ДОБАВЛЕНЫ customer_address и postal_code
    $stmt = $pdo->prepare("INSERT INTO orders (customer_name, customer_email, customer_phone, customer_address, postal_code, total_amount) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $data['customer']['name'],
        $data['customer']['email'] ?? '',
        $data['customer']['phone'],
        $data['customer']['address'] ?? '',
        $data['customer']['postal_code'] ?? '',
        $data['total']
    ]);
    $orderId = $pdo->lastInsertId();

    // Сохраняем позиции
    $itemStmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)");

    foreach ($data['items'] as $item) {
        $prodStmt = $pdo->prepare("SELECT id, stock FROM products WHERE sku = ?");
        $prodStmt->execute([$item['id']]);
        $product = $prodStmt->fetch();

        if (!$product) {
            throw new Exception("Товар '{$item['name']}' не найден в базе");
        }
        if ($product['stock'] < $item['quantity']) {
            throw new Exception("Товар '{$item['name']}' закончился");
        }

        $pdo->prepare("UPDATE products SET stock = stock - ? WHERE id = ?")
            ->execute([$item['quantity'], $product['id']]);

        $itemStmt->execute([$orderId, $product['id'], $item['quantity'], $item['price']]);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'order_id' => $orderId]);

} catch (Exception $e) {
    $pdo->rollBack();
    error_log('Order error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}