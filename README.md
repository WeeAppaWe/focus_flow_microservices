# FocusFlow Microservices

A microservices-based Task Management Application built with **Next.js**, **Express.js**, and **NGINX**.

## 🏗️ Architecture

The application uses **NGINX** as a Reverse Proxy / API Gateway to route requests to the appropriate microservices.

| Service | Technology | Port | Description |
| :--- | :--- | :--- | :--- |
| **Frontend App** | Next.js (React) | `3000` | Main user interface (Dashboard, Auth). |
| **Auth Service** | Express.js | `3001` | Authentication (JWT), User Management. |
| **Task Service** | Express.js | `3002` | Task CRUD, Scheduler for deadlines. |
| **Notification Service** | Express.js | `3003` | Real-time notifications, stored history. |
| **API Gateway** | NGINX | `80` | Routes traffic to services and frontend. |

## 🚀 Getting Started

### Prerequisites
- Node.js & pnpm
- MySQL Database
- NGINX

### 1. Environment Setup
Create `.env` files in each service directory based on `env.template` (if available) or the following structure:

**Frontend** (`frontend-app/.env.local`)
```ini
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_USE_GATEWAY=true
```

**Backend Services** (e.g., `backend-api/auth-service/.env`)
```ini
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=focusflow_auth
JWT_SECRET=your_secret
```

### 2. Installation
Install dependencies for all services:

```bash
# Frontend
cd frontend-app
pnpm install

# Backend Services
cd ../backend-api/auth-service
pnpm install
cd ../task-service
pnpm install
cd ../notification-service
pnpm install
```

### 3. Database Migration
Ensure you have created the necessary MySQL databases (`focusflow_auth`, `focusflow_tasks`, `focusflow_notifications`) and run any synchronization scripts provided in the services.

### 4. NGINX Setup
1.  Locate your NGINX installation (e.g., `C:\nginx`).
2.  Backup your existing `conf/nginx.conf`.
3.  Copy `nginx/nginx.conf` from this repository to your NGINX `conf` folder.
4.  Start or Reload NGINX:
    ```bash
    cd C:\nginx
    start nginx
    # or to reload
    nginx -s reload
    ```

### 5. Running the App
Run each service in a separate terminal:

```bash
# Terminal 1 - Frontend
cd frontend-app
pnpm run dev

# Terminal 2 - Auth Service
cd backend-api/auth-service
pnpm run dev

# Terminal 3 - Task Service
cd backend-api/task-service
pnpm run dev

# Terminal 4 - Notification Service
cd backend-api/notification-service
pnpm run dev
```

The application will be accessible at **http://localhost**.
