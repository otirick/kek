<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

$stmt = $pdo->query("SELECT id, sku, name, price, category, images, description, care, delivery, return_policy FROM products WHERE is_active = 1");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($products as &$p) {
    $p['images'] = json_decode($p['images']);
    $p['description'] = json_decode($p['description']);
    $p['care'] = json_decode($p['care']);
    $p['delivery'] = json_decode($p['delivery']);
    $p['id'] = $p['sku']; // совместимость со старым кодом
}
unset($p);

echo json_encode($products, JSON_UNESCAPED_UNICODE);