# PlaceMint | Full-Stack Internship Tracker

**PlaceMint** is a professional MERN stack application designed to help students and job seekers manage their career journey. This project was built to solve the chaos of tracking multiple internship applications across various platforms.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Authentication:** Clerk Auth
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## Key Features

- **Secure Authentication:** User-friendly login and registration powered by Clerk.
- **Dashboard:** At-a-glance view of all active internship applications.
- **Cloud Sync:** Real-time data persistence with MongoDB Atlas.
- **Responsive Design:** Optimized for both mobile and desktop users.

---

## Project Structure

This is a monorepo containing both the frontend and backend services:

```text
PlaceMint/
├── backend/    # Express API, MongoDB Models, Controllers
└── client/     # React Application, Vite Configuration

git clone [https://github.com/Jtmkr/PlaceMint.git](https://github.com/Jtmkr/PlaceMint.git)
cd PlaceMint

cd backend
npm install
# Create a .env file with your MONGO_URI and CLERK_SECRET_KEY
node server.js

cd ../client
npm install
npm run dev

Author,
Jit Malakar B.Tech Studen
