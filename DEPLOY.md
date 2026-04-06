# Настройка автоматического деплоя через GitHub Actions

## Архитектура деплоя

Проект развёртывается на VPS с использованием Docker Compose из 3 контейнеров:
- **backend** - FastAPI приложение (Python)
- **frontend** - статические файлы (копируются в nginx)
- **nginx** - reverse proxy для маршрутизации запросов

## Необходимые секреты GitHub

Для работы GitHub Actions необходимо добавить следующие секреты в репозиторий:

### 1. `VPS_SSH_KEY`
Приватный SSH ключ для подключения к серверу.

**Как создать:**
```bash
ssh-keygen -t ed25519 -C "github-actions"
```
Скопируйте содержимое файла приватного ключа (обычно `~/.ssh/id_ed25519`) в этот секрет.

### 2. `VPS_HOST`
IP-адрес или доменное имя вашего сервера.

**Пример:** `192.168.1.100` или `example.com`

### 3. `VPS_USER`
Имя пользователя для подключения по SSH.

**Пример:** `root`, `deploy`, `ubuntu`

### 4. `DEPLOY_PATH`
Путь на сервере, куда будут копироваться файлы проекта.

**Пример:** `/opt/shop` или `/home/deploy/shop`

## Как добавить секреты

1. Откройте репозиторий на GitHub
2. Перейдите в **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Добавьте каждый секрет из списка выше

## Настройка сервера

### 1. Установите Docker и Docker Compose

```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER

# Установка Docker Compose (обычно идёт с Docker)
docker compose version
```

### 2. Создайте директорию для деплоя

```bash
sudo mkdir -p /opt/shop
sudo chown $USER:$USER /opt/shop
```

### 3. Добавьте публичный SSH ключ

Скопируйте публичный ключ (`~/.ssh/id_ed25519.pub`) в `~/.ssh/authorized_keys` на сервере:

```bash
ssh-copy-id user@your-server
```

## Запуск вручную (локально)

Для тестирования можно запустить контейнеры локально:

```bash
docker compose up -d --build
```

Приложение будет доступно по адресу: `http://localhost`

## Структура файлов

```
project-vladik/
├── .github/workflows/deploy.yml  # GitHub Actions workflow
├── backend/
│   ├── Dockerfile                # Dockerfile для бэкенда
│   └── .dockerignore             # Исключения для бэкенда
├── Dockerfile.frontend           # Dockerfile для фронтенда
├── nginx.conf                    # Конфигурация nginx
├── docker-compose.yml            # Оркестрация контейнеров
└── .dockerignore                 # Исключения для фронтенда
```

## Как работает деплой

1. При пуше в `main` или `master` запускается GitHub Actions
2. Код копируется на сервер через SSH/rsync
3. На сервере выполняется:
   - `docker compose down` - остановка старых контейнеров
   - `docker compose up -d --build` - сборка и запуск новых
   - `docker system prune -af` - очистка старых образов

## Маршрутизация запросов

- `http://your-domain/` → фронтенд (статические файлы)
- `http://your-domain/api/*` → бэкенд (FastAPI)

**Важно:** В JavaScript-коде фронтенда запросы к API должны использовать относительные пути с префиксом `/api/`:

```javascript
// Правильно:
const res = await fetch("/api/products");

// Неправильно:
const res = await fetch("http://127.0.0.1:8000/products");
```

## SSL/HTTPS (опционально)

Для настройки HTTPS рекомендуется использовать Certbot с Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```
