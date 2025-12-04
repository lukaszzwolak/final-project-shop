🛒 Final Project Shop

Fullstack e-commerce app built with NestJS, React, Prisma, and PostgreSQL, deployed on Hetzner Cloud (Ubuntu 24.04) with Nginx and PM2.

🚀 Stack Overview
Layer	Technology
Frontend	React + Vite
Backend	NestJS
ORM	Prisma
Database	PostgreSQL
Server	Ubuntu 24.04 (Hetzner Cloud)
Proxy & Static Serving	Nginx
Process Manager	PM2
⚙️ Project Structure
final-project-shop/
├── api/           # NestJS backend
│   ├── prisma/    # Prisma schema and seed
│   ├── src/
│   └── .env
├── client/        # React frontend (Vite)
│   ├── src/
│   └── .env
└── README.md

🧱 Installation & Setup (Local or Server)
1️⃣ Clone the project
git clone https://github.com/lukaszzwolak/final-project-shop.git
cd final-project-shop

2️⃣ Backend (/api)
Install dependencies
cd api
npm ci

Environment variables (api/.env)
DATABASE_URL=postgresql://final_shop_user:MED***@localhost:5432/final_shop
PORT=4000
CLIENT_URL=http://188.245.218.146
NODE_ENV=production

Prisma setup
npm run prisma:generate
npm run prisma:push
npm run prisma:seed

Build & run
npm run build
pm2 start dist/main.js --name shop-api


Test the API:

curl http://127.0.0.1:4000/api/health

3️⃣ Frontend (/client)
Install dependencies
cd ../client
npm ci

Environment variables (client/.env)
VITE_API_URL=http://188.245.218.146/api

Build production bundle
npm run build


Output: client/dist

🗄️ PostgreSQL Setup (Hetzner Server)
CREATE USER final_shop_user WITH PASSWORD 'MEDIVALTOTALwar2';
CREATE DATABASE final_shop OWNER final_shop_user;


Verify connection:

psql "postgresql://final_shop_user:MEDIVALTOTALwar2@127.0.0.1:5432/final_shop" -c '\dt'

🌐 Nginx Configuration

Path: /etc/nginx/sites-available/shop

server {
    listen 80;
    server_name _;

    root /var/www/final-project-shop/client/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri /index.html;
    }
}


Enable and reload:

ln -sf /etc/nginx/sites-available/shop /etc/nginx/sites-enabled/shop
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

🧭 Deployment Summary (Hetzner Cloud)

SSH Setup

ssh root@<SERVER_IP>


Install environment

apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git postgresql postgresql-contrib nginx
npm i -g pm2


Pull project & configure .env

mkdir -p /var/www && cd /var/www
git clone https://github.com/lukaszzwolak/final-project-shop.git


Backend setup

cd api
npm ci && npm run prisma:generate && npm run prisma:push && npm run prisma:seed && npm run build
pm2 start dist/main.js --name shop-api


Frontend build

cd ../client
npm ci && npm run build


Nginx configuration (see above)

✅ Verification

API health check:

curl http://188.245.218.146/api/health


→ returns { "ok": true }

Web app:
🌍 http://188.245.218.146

PM2 process list:

pm2 ls
pm2 logs shop-api

🔒 (Optional) SSL Setup
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
systemctl reload nginx

👨‍💻 Author

Łukasz Zwolak
Fullstack Developer — NestJS / React / PostgreSQL
GitHub: lukaszzwolak

