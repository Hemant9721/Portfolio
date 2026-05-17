# Hemant Soni — Dynamic Portfolio

A fully dynamic, admin-managed portfolio built with the MERN stack.

## Features

- **Fully editable from the browser** — no code changes needed for content updates
- **Hero section** — editable name, greeting, roles, tagline, social links
- **About section** — editable bio, stats, timeline, resume upload (PDF)
- **Skills section** — add/edit/delete skill groups and tech badges
- **Projects section** — add/edit/delete projects with filtering
- **Contact section** — editable contact info (email, phone, location, social links)
- **Messages Dashboard** — view, read, and delete incoming contact form submissions
- **Issues counter** — unread message count shown in the navbar (auto-refreshes every 30s)

## Setup

### 1. Server

```bash
cd server
npm install
```

Create `server/.env`:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=yourStrongPassword123
EMAIL_USER=gmail@gmail.com      # Optional: for email notifications
EMAIL_PASS=your_app_password    # Optional: Gmail App Password
CLIENT_URL=http://localhost:5173
PORT=5000
```

```bash
npm run dev
```

### 2. Client

```bash
cd client
npm install
npm run dev
```

### 3. Admin Access

- Scroll to the footer and click **"Admin"** (bottom right)
- Enter your `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the `.env`
- Once logged in, all sections become fully editable inline

## Admin Editing

- **Hero** — Click any text to edit it inline; manage roles list; update social URLs
- **About** — Edit bio paragraphs, stats, timeline entries; upload resume PDF
- **Skills** — Add/Edit/Delete skill groups via modal; manage tech badges inline
- **Projects** — Add/Edit/Delete projects via modal; set featured/category
- **Contact** — Click any contact detail to edit it inline (email, phone, location, note, social URLs)
- **Messages** — Click "Messages" button in navbar to view/manage all contact form submissions

## Deployment

- **Server**: Railway, Render, or any Node.js host
- **Client**: Vercel (set `VITE_API_URL` or configure the proxy in `vite.config.js`)
