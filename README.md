# notes-app
# Minimalistic Notes App

A modern, minimalistic, and fully functional Notes App built with **React** (frontend), **Node.js + Express** (backend), **MySQL** (database), and **Nginx** (reverse proxy). The project uses **Docker Compose** to run all services in containers and is designed to be visually appealing, responsive, and easy to use.

---

## Features

- Add, update, and delete notes
- Colorful, tech-savvy, minimalistic UI
- Three-dot menu for additional note options
- Header and footer components
- Gradient backgrounds and subtle animations
- Responsive design (works on mobile and desktop)
- Local storage support for offline persistence (optional)
- Fully containerized using Docker Compose

---

## Technology Stack

- **Frontend:** React, Hooks (`useState`, `useEffect`), Lucide icons
- **Backend:** Node.js, Express.js, MySQL2
- **Database:** MySQL 8
- **Reverse Proxy / Web Server:** Nginx
- **Containerization:** Docker & Docker Compose

---

## Project Structure

```text
notes-app/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── wait-for-it.sh
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
└── init.sql
