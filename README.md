# Blog Platform

A full-stack blog platform built with:
- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Express, TypeScript, Prisma, PostgreSQL
- **API features:** authentication, posts, comments, likes, image uploads, tags, author profile
- **Cloud services:** Cloudinary image storage

## Project Overview

This repository contains two main applications:
- `client/` — the Next.js frontend and UI
- `server/` — the Express API, Prisma ORM, and PostgreSQL backend

The app supports:
- user registration and login
- JWT access and refresh token authentication
- creating and managing blog posts
- publishing posts with markdown content and tags
- uploading cover images via Cloudinary
- adding comments
- liking posts
- fetching personal posts and post detail pages

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Icons

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Cloudinary
- JWT authentication
- bcryptjs
- multer
- zod

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd blog-platform
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create a `.env` file in `server/` with the following values:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DIRECT_URL=http://localhost:3000
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Set up the database

The backend uses Prisma with PostgreSQL. Run migrations and seed the database:

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

The seed script creates a default admin user and sample posts.

### 5. Start the applications

Open two terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Default Seed User

The seed script creates a default user for local development.

- Email: `sarah@example.com`
- Password: `password123`

## API Routes

### Auth
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive JWT tokens
- `POST /api/auth/refresh-token` — refresh access token
- `POST /api/auth/logout` — logout user

### Posts
- `GET /api/posts` — get all published posts
- `GET /api/posts/:id` — get post details
- `GET /api/my-posts` — get posts of authenticated user
- `POST /api/create-post` — create a new post (authenticated)
- `POST /api/posts/:id/comment` — add comment to a post (authenticated)
- `POST /api/posts/:id/like` — toggle like for a post (authenticated)
- `DELETE /api/posts/:id` — delete a post (authenticated)

## Project Structure

### `client/`
- `src/app/` — Next.js app routes and pages
- `src/components/` — UI components
- `src/context/` — authentication context
- `src/hooks/` — custom hooks for auth, posts, comments
- `src/lib/` — Axios instance
- `src/services/` — API services and repositories
- `src/types/` — shared TypeScript types

### `server/`
- `src/app.ts` — Express app setup
- `src/server.ts` — app entrypoint
- `src/config/` — environment and config
- `src/controllers/` — route controllers
- `src/routes/` — express routes
- `src/middlewares/` — auth, file upload, request handling
- `src/prisma/` — Prisma client
- `src/services/` — business logic and repository access
- `prisma/schema.prisma` — data model definitions
- `prisma/seed.ts` — database seed script

## Notes

- The API allows CORS from `http://localhost:3000`.
- The frontend expects the backend to be available at the configured `DIRECT_URL`.
- Images are uploaded using Cloudinary through the server.
- The Prisma schema includes `User`, `Post`, `Comment`, and `Like` models.

## Production Build

### Client

```bash
cd client
npm run build
npm start
```

### Server

```bash
cd server
npm run start
```

## License

This project is licensed under the ISC License.
