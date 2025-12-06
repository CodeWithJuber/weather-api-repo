# Hosting Company CMS

A full-stack hosting company website with a backend admin panel for content management.

## Features

- **Public Homepage**: Modern, responsive hosting company landing page
- **Admin Panel**: Full content management system for homepage sections
- **Database**: SQLite database for easy deployment
- **Authentication**: Secure admin authentication with JWT

## Tech Stack

### Backend
- Node.js with Express.js
- SQLite with better-sqlite3
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- CSS Modules for styling

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── database.js     # Database setup
│   │   └── server.js       # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app
│   └── package.json
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Start development servers:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:3001
- Frontend on http://localhost:5173

### Default Admin Credentials

- **Email**: admin@hostingcompany.com
- **Password**: admin123

> ⚠️ Change these credentials in production!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current admin

### Content Management (Protected)
- `GET /api/content/:section` - Get section content
- `PUT /api/content/:section` - Update section content
- `GET /api/content` - Get all content

### Public API
- `GET /api/public/content` - Get all homepage content

## Content Sections

The admin panel manages the following homepage sections:

1. **Hero Section** - Main banner with headline and CTA
2. **Services** - Hosting services offered
3. **Pricing Plans** - Pricing tiers and features
4. **Features** - Key features and benefits
5. **Testimonials** - Customer reviews
6. **Stats** - Company statistics
7. **Contact** - Contact information

## License

MIT
