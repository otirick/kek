<?php
session_start();

require_once __DIR__ . '/api/db.php';


$ADMIN_PASS = '2026';

// --- Логика входа/выхода ---
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if ($_POST['password'] === $ADMIN_PASS) {
        $_SESSION['admin_auth'] = true;
        header('Location: ' . $_SERVER['PHP_SELF']);
        exit;
    } else {
        $login_error = 'Неверный пароль';
    }
}

$is_auth = !empty($_SESSION['admin_auth']);

// --- Обновление статуса ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['order_id'], $_POST['new_status'])) {
    $allowed = ['pending', 'paid', 'shipped', 'cancelled'];
    $new_status = in_array($_POST['new_status'], $allowed) ? $_POST['new_status'] : 'pending';
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$new_status, (int)$_POST['order_id']]);
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// --- HTML/CSS ---
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админка заказов | Prostranstvo</title>
    <style>
        :root { --bg: #f4f6f9; --card: #fff; --primary: #2563eb; --text: #1e293b; --border: #e2e8f0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); margin: 0; padding: 20px; }
        .container { max-width: 1400px; margin: 0 auto; background: var(--card); padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        h1 { margin: 0 0 20px 0; font-size: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--border); }
        th { background: #f8fafc; font-weight: 600; font-size: 14px; color: #64748b; }
        .status { padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 500; }
        .pending { background: #fef3c7; color: #92400e; }
        .paid { background: #dcfce7; color: #166534; }
        .shipped { background: #dbeafe; color: #1e40af; }
        .cancelled { background: #fee2e2; color: #991b1b; }
        .btn { padding: 8px 14px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: 0.2s; }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-danger { background: #ef4444; color: #fff; }
        .btn-danger:hover { background: #dc2626; }
        .login-box { max-width: 400px; margin: 15vh auto; padding: 32px; background: var(--card); border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); text-align: center; }
        .login-box input { width: 100%; padding: 12px; margin: 16px 0; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; }
        .details-row { display: none; background: #f8fafc; }
        .details-row.open { display: table-row; }
        .details-cell { padding: 20px; }
        .item-card { background: #fff; padding: 12px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
        .toggle-btn { background: none; border: 1px solid var(--border); padding: 4px 8px; border-radius: 4px; cursor: pointer; color: var(--primary); font-size: 13px; }
        .toggle-btn:hover { background: #f1f5f9; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 16px; }
        .info-label { font-size: 12px; color: #64748b; }
        .info-val { font-weight: 500; }
        select { padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border); background: #fff; cursor: pointer; }
    </style>
</head>
<body>
<div class="container">
    <?php if (!$is_auth): ?>
        <div class="login-box">
            <h2>Вход в админку</h2>
            <?php if (!empty($login_error)) echo "<p style='color:#ef4444'>$login_error</p>"; ?>
            <form method="POST">
                <input type="password" name="password" placeholder="Введите пароль" required autofocus>
                <button type="submit" class="btn btn-primary" style="width:100%">Войти</button>
            </form>
        </div>
    <?php else: ?>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h1>Заказы</h1>
            <a href="?logout" class="btn btn-danger">Выйти</a>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width:60px">№</th>
                    <th>Дата</th>
                    <th>Клиент</th>
                    <th>Телефон / Email</th>
                    <th>Сумма</th>
                    <th style="width:120px">Статус</th>
                    <th style="width:100px">Товары</th>
                    <th style="width:150px">Действия</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $orders = $pdo->query("SELECT id, customer_name, customer_phone, customer_email, total_amount, status, created_at FROM orders ORDER BY id DESC")->fetchAll();

                if (empty($orders)): ?>
                    <tr><td colspan="8" style="text-align:center; padding:40px; color:#64748b;">Заказов пока нет</td></tr>
                <?php else:
                    // Pre-fetch items
                    $order_ids = array_map('intval', array_column($orders, 'id'));
                    $items_map = [];
                    if ($order_ids) {
                        $in = implode(',', $order_ids);
                        $res = $pdo->query("SELECT oi.order_id, oi.quantity, oi.price_at_purchase, p.name, p.sku FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id IN ($in) ORDER BY oi.order_id, oi.id");
                        while($row = $res->fetch()) $items_map[$row['order_id']][] = $row;
                    }

                    $status_map = [
                        'pending' => ['label' => 'Ожидает', 'cls' => 'pending'],
                        'paid' => ['label' => 'Оплачен', 'cls' => 'paid'],
                        'shipped' => ['label' => 'Отправлен', 'cls' => 'shipped'],
                        'cancelled' => ['label' => 'Отменён', 'cls' => 'cancelled']
                    ];

                    foreach ($orders as $o):
                        $st = $status_map[$o['status']] ?? $status_map['pending'];
                        $total = number_format($o['total_amount'], 0, ',', ' ') . ' ₽';
                        $date = date('d.m.Y H:i', strtotime($o['created_at']));
                ?>
                <tr>
                    <td>#<?= $o['id'] ?></td>
                    <td><?= $date ?></td>
                    <td><?= htmlspecialchars($o['customer_name']) ?></td>
                    <td><?= htmlspecialchars($o['customer_phone']) ?><br>📧 <?= htmlspecialchars($o['customer_email'] ?: '—') ?></td>
                    <td><strong><?= $total ?></strong></td>
                    <td><span class="status <?= $st['cls'] ?>"><?= $st['label'] ?></span></td>
                    <td><button class="toggle-btn" onclick="toggle(<?= $o['id'] ?>)">Показать</button></td>
                    <td>
                        <form method="POST" style="display:inline-block;">
                            <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                            <select name="new_status" onchange="this.form.submit()">
                                <?php foreach ($status_map as $k => $v): ?>
                                    <option value="<?= $k ?>" <?= $o['status']==$k?'selected':'' ?>><?= $v['label'] ?></option>
                                <?php endforeach; ?>
                            </select>
                        </form>
                    </td>
                </tr>
                <tr class="details-row" id="row-<?= $o['id'] ?>">
                    <td colspan="8" class="details-cell">
                        <div class="info-grid">
                            <div><div class="info-label">Адрес доставки</div><div class="info-val"><?= htmlspecialchars($o['customer_address'] ?? 'Не указан') ?></div></div>
                            <div><div class="info-label">Индекс</div><div class="info-val"><?= htmlspecialchars($o['postal_code'] ?? '—') ?></div></div>
                        </div>
                        <div style="margin-top:12px; font-weight:500;">📦 Состав заказа:</div>
                        <?php if (!empty($items_map[$o['id']])):
                            foreach ($items_map[$o['id']] as $item):
                                $sum = $item['quantity'] * $item['price_at_purchase'];
                        ?>
                        <div class="item-card">
                            <div>
                                <strong><?= htmlspecialchars($item['name']) ?></strong>
                                <span style="color:#64748b; font-size:12px;">(<?= htmlspecialchars($item['sku']) ?>)</span>
                            </div>
                            <div style="text-align:right;">
                                <?= $item['quantity'] ?> шт × <?= number_format($item['price_at_purchase'], 2, ',', ' ') ?> ₽<br>
                                <strong>= <?= number_format($sum, 2, ',', ' ') ?> ₽</strong>
                            </div>
                        </div>
                        <?php endforeach; else: ?>
                            <div style="color:#64748b; font-style:italic;">Товары не найдены</div>
                        <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; endif; ?>
            </tbody>
        </table>

        <script>
            function toggle(id) {
                const row = document.getElementById('row-' + id);
                row.classList.toggle('open');
                row.querySelector('.toggle-btn')?.classList.toggle('open');
            }
        </script>
    <?php endif; ?>
</div>
</body>
</html>