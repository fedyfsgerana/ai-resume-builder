# AI Resume Builder

AI-powered resume builder SaaS that helps job seekers create tailored resumes automatically based on job descriptions.

---

# 🚀 Features

- AI-generated resume content
- Resume tailoring based on job descriptions
- Authentication with JWT
- Resume CRUD system
- Resume export to PDF
- Match score analysis
- Responsive modern UI
- Secure backend architecture
- REST API support

---

# 🛠 Tech Stack

## Frontend

- Vue 3 (Composition API)
- Tailwind CSS
- Vue Router
- Pinia
- Axios
- Vite
- Lucide Vue Next

## Backend

- Express.js
- JWT Authentication
- Bcrypt
- Zod
- Prisma ORM
- Helmet
- CORS
- Pino Logger

## Database

- PostgreSQL
- Prisma ORM

## AI Provider

- Groq API

---

# 📁 Project Structure

```bash
ai-resume-builder/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── package.json
│   ├── nodemon.json
│   └── .eslintrc.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── router/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── App.vue
│   │   └── main.js
│   │
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   └── .prettierrc
│
├── README.md
└── package.json
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-resume-builder.git
cd ai-resume-builder
```

## 2. Install Dependencies

```bash
npm run install:all
```

---

# 🔧 Backend Setup

## 1. Go to Backend Folder

```bash
cd backend
```

## 2. Create Environment File

```bash
cp .env.example .env
```

## 3. Configure `.env`

```env
PORT=5000

DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_resume_builder"

JWT_SECRET=your_jwt_secret

GROQ_API_KEY=your_groq_api_key
```

---

# 🗄 Database Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

# ▶️ Run Project

Back to root folder:

```bash
cd ..
```

Run frontend and backend together:

```bash
npm run dev
```

---

# 🌐 Application Access

| Service          | URL                              |
| ---------------- | -------------------------------- |
| Frontend         | http://localhost:5173            |
| Backend          | http://localhost:5000            |
| API Health Check | http://localhost:5000/api/health |

---

# 🔐 API Endpoints

## Authentication

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/api/auth/register`      |
| POST   | `/api/auth/login`         |
| POST   | `/api/auth/logout`        |
| POST   | `/api/auth/refresh-token` |
| GET    | `/api/auth/profile`       |

---

## Resume

| Method | Endpoint                 |
| ------ | ------------------------ |
| POST   | `/api/resume`            |
| GET    | `/api/resume`            |
| GET    | `/api/resume/:id`        |
| PUT    | `/api/resume/:id`        |
| DELETE | `/api/resume/:id`        |
| GET    | `/api/resume/:id/export` |

---

## AI Features

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/api/ai/:id/generate`    |
| POST   | `/api/ai/:id/regenerate`  |
| GET    | `/api/ai/:id/match-score` |

---

# 📦 Backend Files

```bash
backend/
│
├── .env
├── package.json
├── nodemon.json
├── .eslintrc.json
│
├── prisma/
│   └── schema.prisma
│
└── src/
    ├── server.js
    ├── app.js
    │
    ├── config/
    │   ├── logger.js
    │   ├── db.js
    │   └── env.js
    │
    ├── models/
    │   ├── User.js
    │   └── Resume.js
    │
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    │
    ├── utils/
    │   ├── validator.js
    │   └── generatePDF.js
    │
    ├── services/
    │   ├── groqService.js
    │   └── pdfService.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── resumeController.js
    │   └── aiController.js
    │
    └── routes/
        ├── authRoutes.js
        ├── resumeRoutes.js
        └── aiRoutes.js
```

---

# 🎨 Frontend Files

```bash
frontend/
│
├── .env
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
├── index.html
│
└── src/
    ├── main.js
    ├── App.vue
    │
    ├── styles/
    │   └── global.css
    │
    ├── router/
    │   └── index.js
    │
    ├── services/
    │   ├── api.js
    │   ├── authService.js
    │   └── resumeService.js
    │
    ├── stores/
    │   ├── authStore.js
    │   └── resumeStore.js
    │
    ├── composables/
    │   ├── useAuth.js
    │   └── useResume.js
    │
    ├── layouts/
    │   ├── MainLayout.vue
    │   └── AuthLayout.vue
    │
    ├── components/
    │   ├── Navbar.vue
    │   ├── Footer.vue
    │   └── LoadingSpinner.vue
    │
    └── pages/
        ├── Home.vue
        ├── Login.vue
        ├── Register.vue
        ├── Dashboard.vue
        ├── Builder.vue
        └── NotFound.vue
```

---

# 🔒 Security Features

- Password hashing with bcrypt
- JWT Authentication
- Protected API routes
- Helmet security headers
- CORS protection
- Input validation using Zod

---

# 📄 Environment Variables

## Backend `.env`

```env
PORT=5000

DATABASE_URL=

JWT_SECRET=

GROQ_API_KEY=
```

## Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 📜 Scripts

## Root Scripts

```bash
npm run dev
npm run install:all
```

## Backend Scripts

```bash
npm run dev
npm run start
npm run prisma:migrate
npm run prisma:generate
```

## Frontend Scripts

```bash
npm run dev
npm run build
npm run preview
```

---

# 🧠 AI Features

- Generate professional resume summaries
- Improve work experience descriptions
- Tailor resumes to job descriptions
- ATS keyword optimization
- Resume match score analysis

Powered by Groq LLM API for ultra-fast AI response generation.

---

# 📌 Future Improvements

- Resume templates
- Drag & drop editor
- Multi-language support
- LinkedIn import
- AI cover letter generator
- Subscription system
- Team collaboration

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Developed with ❤️ using Vue 3, Express.js, PostgreSQL, Prisma, and Groq API.
