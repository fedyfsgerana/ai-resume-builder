# AI Resume Builder

AI Resume Builder is a web-based SaaS platform that helps job seekers create and customize resumes automatically using AI based on a specific Job Description. The system is designed to simplify the resume creation process, improve ATS compatibility, and generate professional resumes in minutes.

---

# ✨ Features

- 🔐 Authentication & User Management
- 📄 Manual Resume Input or PDF/DOCX Upload
- 🤖 AI-Generated Professional Summary
- 🧠 AI Rewrite Experience Bullet Points
- 📊 Resume Match Score Analysis
- 📝 Real-time Resume Editor
- 🎨 ATS-Friendly Resume Templates
- 📥 Export Resume to PDF
- 📂 Multiple Resume Management
- 📈 Resume Dashboard & Tracking

---

# 🚀 Main Workflow

## 1. Authentication

Users can:

- Register using email & password
- Login with OAuth
- Verify email address
- Access personal dashboard

---

## 2. Resume Data Input

Users can:

- Fill resume form manually
- Upload existing resume (PDF/DOCX)
- Automatically parse uploaded resume
- Save multiple resume bases

Stored information includes:

- Personal information
- Work experience
- Education
- Skills
- Certifications

---

## 3. Job Description Input

Users only need to:

1. Paste the job description
2. System analyzes important keywords
3. Compare resume against the job description
4. Display missing keywords

---

## 4. AI Resume Generation

AI will:

- Rewrite work experience bullet points
- Generate professional summary
- Reorder skills based on job relevance
- Generate Match Score (0-100)

---

## 5. Review & Edit

Editor features:

- Split-screen editor
- Live preview
- AI-highlighted changes
- Regenerate specific sections
- Auto-save drafts

---

## 6. Export PDF

Users can:

- Choose resume templates
- Preview final resume
- Export ATS-friendly PDF
- Save export history

---

# 🧩 System Modules

## 🔐 Auth Module

- Login/Register
- OAuth Authentication
- Password Reset
- Session Management
- Subscription Tier Management

---

## 📄 Resume Base Module

- Multiple Resume Management
- Resume Upload & Parsing
- Structured Resume Form
- Resume History
- Resume Data Export

---

## 📌 Job Description Module

- Save Job Descriptions
- Keyword Extraction
- Gap Analysis
- Keyword Suggestions
- Job Description History

---

## 🤖 AI Generator Module

- Generate Experience Bullet Points
- Generate Professional Summary
- Skill Prioritization
- Section Regeneration
- Tone Adjustment

---

## 📊 Match Score Module

- Score Calculation (0-100)
- Score Breakdown
- Keyword Highlighting
- Improvement Suggestions
- Real-time Updates

---

## 📝 Resume Editor Module

- Rich Text Editor
- Split-screen Preview
- AI Change Highlight
- Undo / Redo
- Auto-save Draft

---

## 🎨 Template & Export Module

- ATS-Friendly Templates
- Font & Color Customization
- PDF Export
- Export History
- Print Preview

---

## 📈 Dashboard Module

- Resume List
- Match Score Tracking
- Usage Statistics
- Notifications & Reminders
- Duplicate/Delete Resume

---

# 🛠️ MVP Roadmap

| Feature                    | MVP | V1.0 | V2.0 |
| -------------------------- | --- | ---- | ---- |
| Auth & Registration        | ✅  | ✅   | ✅   |
| Manual Resume Input        | ✅  | ✅   | ✅   |
| Job Description Input      | ✅  | ✅   | ✅   |
| AI Generate Bullet Points  | ✅  | ✅   | ✅   |
| AI Generate Summary        | ✅  | ✅   | ✅   |
| Export PDF                 | ✅  | ✅   | ✅   |
| Dashboard                  | ✅  | ✅   | ✅   |
| Resume Parser Upload       | ❌  | ✅   | ✅   |
| Match Score                | ❌  | ✅   | ✅   |
| Split-screen Editor        | ❌  | ✅   | ✅   |
| Multiple Templates         | ❌  | ✅   | ✅   |
| Regenerate per Section     | ❌  | ✅   | ✅   |
| Stripe Billing             | ❌  | ✅   | ✅   |
| LinkedIn Import            | ❌  | ❌   | ✅   |
| Multi-client Business Tier | ❌  | ❌   | ✅   |

---

# ⚙️ Suggested Tech Stack

## Frontend

- Next.js
- Tailwind CSS
- React Query
- Zustand

## Backend

- Laravel / Node.js
- REST API
- JWT Authentication

## AI Services

- OpenAI API
- Resume Prompt Engineering

## Database

- MySQL / PostgreSQL

## Storage

- AWS S3 / Cloudinary

## PDF Engine

- Puppeteer
- DomPDF

---

# 📂 Project Structure

```bash
ai-resume-builder/
│
├── frontend/
├── backend/
├── ai-services/
├── database/
├── templates/
├── uploads/
└── README.md
```

---

# 📌 Important Notes

- The MVP should focus on AI output quality
- ATS-friendly is not only about design templates
- Match Score is the main retention feature
- Save all user resume history
- Validate the market before scaling features

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed with ❤️ by Fedy Fs. Gerana
