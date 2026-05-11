# AI Resume Builder

AI-powered resume builder SaaS that helps job seekers create tailored resumes automatically based on job descriptions.

## Tech Stack

### Frontend

- Vue 3 (Composition API)
- Tailwind CSS
- Vue Router
- Pinia
- Axios
- Vite
- Lucide Vue Next

### Backend

- Express.js
- JWT Authentication
- Bcrypt
- Zod
- Prisma ORM
- Helmet + CORS
- Pino (logging)

### Database

- PostgreSQL
- Prisma

## Project Structure

ai-resume-builder/
├── backend/
│ ├── prisma/
│ │ └── schema.prisma
│ ├── src/
│ │ ├── config/
│ │ ├── controllers/
│ │ ├── middleware/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── services/
│ │ ├── utils/
│ │ ├── app.js
│ │ └── server.js
│ ├── .env
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── composables/
│ │ ├── layouts/
│ │ ├── pages/
│ │ ├── router/
│ │ ├── services/
│ │ ├── stores/
│ │ ├── styles/
│ │ ├── App.vue
│ │ └── main.js
│ ├── .env
│ └── package.json
└── README.md

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL
- Redis (optional, for caching)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

2. Install all dependencies

```bash
npm run install:all
```

3. Setup backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your credentials:

- DATABASE_URL with your PostgreSQL connection string
- JWT_SECRET with a random secret key
- OPENAI_API_KEY with your OpenAI API key

4. Run database migrations

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the project

```bash
cd ..
npm run dev
```

### Access

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## API Endpoints

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token
- GET /api/auth/profile

### Resume

- POST /api/resume
- GET /api/resume
- GET /api/resume/:id
- PUT /api/resume/:id
- DELETE /api/resume/:id
- GET /api/resume/:id/export

### AI

- POST /api/ai/:id/generate
- POST /api/ai/:id/regenerate
- GET /api/ai/:id/match-score

## License

MIT

Semua file sudah selesai. Berikut ringkasan semua file yang sudah dibuat:
Backend

.env
package.json
nodemon.json
.eslintrc.json
prisma/schema.prisma
src/server.js
src/app.js
src/config/logger.js
src/config/db.js
src/config/env.js
src/models/User.js
src/models/Resume.js
src/middleware/authMiddleware.js
src/middleware/errorMiddleware.js
src/utils/validator.js
src/utils/generatePDF.js
src/services/openaiService.js
src/services/pdfService.js
src/controllers/authController.js
src/controllers/resumeController.js
src/controllers/aiController.js
src/routes/authRoutes.js
src/routes/resumeRoutes.js
src/routes/aiRoutes.js

Frontend

.env
package.json
vite.config.js
tailwind.config.js
postcss.config.js
.eslintrc.json
.prettierrc
index.html
src/main.js
src/App.vue
src/styles/global.css
src/router/index.js
src/services/api.js
src/services/authService.js
src/services/resumeService.js
src/stores/authStore.js
src/stores/resumeStore.js
src/composables/useAuth.js
src/composables/useResume.js
src/layouts/MainLayout.vue
src/layouts/AuthLayout.vue
src/components/Navbar.vue
src/components/Footer.vue
src/components/LoadingSpinner.vue
src/pages/Home.vue
src/pages/Login.vue
src/pages/Register.vue
src/pages/Dashboard.vue
src/pages/Builder.vue
src/pages/NotFound.vue
