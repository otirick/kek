# Backend — Магазин фирменной и сувенирной продукции

FastAPI + SQLAlchemy + SQLite

---

## Установка и запуск

```bash
# 1. Перейти в папку backend
cd backend

# 2. Активировать
# Windows:
.\venv\Scripts\activate

# 3. Запустить сервер
python main.py
```

Сервер запустится на **http://127.0.0.1:8000**

Swagger-документация (авто): **http://127.0.0.1:8000/docs**

---

## Base URL

```
http://127.0.0.1:8000
```

Все эндпоинты указаны относительно этого адреса.

---

## Структура API

Три сущности, каждая с полным CRUD:

| Сущность | Эндпоинты |
|----------|-----------|
| **Products** | `GET/POST /products`, `GET/PUT/DELETE /products/{id}` |
| **Cart** | `GET/POST /cart`, `GET/PUT/DELETE /cart/{id}`, `DELETE /cart` |
| **Reviews** | `GET/POST /reviews`, `GET/PUT/DELETE /reviews/{id}` |

- `GET /products` поддерживает пагинацию (`page`, `limit`) и фильтр по категории (`category`)
- `GET /reviews` поддерживает пагинацию (`page`, `limit`)
- Все `POST` и `PUT` принимают JSON-тело

---

## Примеры запросов на JavaScript (fetch)

### Получить все товары

```js
const res = await fetch("http://127.0.0.1:8000/products");
const products = await res.json();
console.log(products);
```

### Получить товары с пагинацией и фильтром

```js
const res = await fetch("http://127.0.0.1:8000/products?category=tshirt&page=1&limit=5");
const products = await res.json();
```

### Создать товар

```js
const res = await fetch("http://127.0.0.1:8000/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Футболка",
    description: "Хлопковая футболка с логотипом",
    price: 990,
    category: "tshirt",
    count: 50,
  }),
});
const product = await res.json();
console.log(product);
```

### Обновить товар

```js
const res = await fetch("http://127.0.0.1:8000/products/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Футболка новая",
    description: "Обновлённое описание",
    price: 1200,
    category: "tshirt",
    count: 30,
  }),
});
```

### Удалить товар

```js
await fetch("http://127.0.0.1:8000/products/1", { method: "DELETE" });
```

### Добавить товар в корзину

```js
await fetch("http://127.0.0.1:8000/cart", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ product_id: 1, count: 2 }),
});
```

### Получить корзину

```js
const res = await fetch("http://127.0.0.1:8000/cart");
const cart = await res.json();
```

### Создать отзыв

```js
await fetch("http://127.0.0.1:8000/reviews", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Отличный товар!",
    username: "ivan",
    rating: 5,
  }),
});
```

---

## Формат ответов

Все ответы — JSON. Status codes стандартные: `200` (OK), `201` (Created), `400` (Bad Request), `404` (Not Found).

Пример ответа `GET /products`:

```json
[
  {
    "id": 1,
    "name": "Футболка",
    "description": "Хлопковая футболка",
    "price": 990.0,
    "image_url": "",
    "category": "tshirt",
    "count": 50
  }
]
```

---

## База данных

SQLite-файл `shop.db` создаётся автоматически в папке `backend/`. Таблицы создаются при запуске. Если изменил модель — удали `shop.db` и перезапусти.
