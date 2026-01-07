# NGINX API Gateway Setup Guide

## Prerequisites
- NGINX installed on your system
- Backend running on port 3001
- Frontend running on port 3000

## Installation

### Windows (Using NGINX for Windows)
1. Download NGINX from: https://nginx.org/en/download.html
2. Extract to `C:\nginx`
3. Copy `nginx.conf` to `C:\nginx\conf\nginx.conf`
4. Run: `C:\nginx\nginx.exe`

### Linux/Mac
```bash
# Install NGINX
sudo apt install nginx   # Ubuntu/Debian
brew install nginx       # macOS

# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/task-app
sudo ln -s /etc/nginx/sites-available/task-app /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Start/Restart NGINX
sudo systemctl restart nginx
```

## Access
After NGINX is running:
- **Frontend**: http://localhost (port 80)
- **API**: http://localhost/api/*
- **WebSocket**: http://localhost/socket.io/

## Architecture
```
[Browser] --> [NGINX :80] --> ┌─ /api/auth/*  --> [Backend :3001]
                              ├─ /api/tasks   --> [Backend :3002]
                              ├─ /socket.io/  --> [Backend :3002]
                              ├─ /api/notifications --> [Backend :3003]
                              └─ /*           --> [Frontend :3000]
```

## Rate Limits
- Auth routes: 1 req/sec (burst 5)
- API routes: 10 req/sec (burst 20)

## Notes
- For production, enable HTTPS with SSL certificates
- Update `server_name` with your actual domain
