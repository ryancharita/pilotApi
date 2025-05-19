# API

A Node.js RESTful API built with Express, designed for deployment on Vercel. This project includes authentication, validation, and PostgreSQL integration.

---

## 📦 Project Info

- **Version:** 1.0.0  
- **Main Entry Point:** `index.js`  
- **License:** ISC  

---

## 🚀 Features

- 🌐 RESTful API with Express.js  
- 🔐 JWT-based Authentication  
- 🔒 Password Hashing with Bcrypt  
- 📚 Input Validation using Zod  
- 🗄️ PostgreSQL Database Integration (via `pg`)  
- 🌍 CORS Support  
- 📖 Environment Variable Management with Dotenv  

---

## 📂 Project Structure

```plaintext
├── index.js
├── routes/
├── controllers/
├── middlewares/
├── db/
├── .env
└── package.json

📖 Getting Started
1️⃣ Clone the

```git clone <repository-url>
cd api```

2️⃣ Install Dependencies
```npm install```

3️⃣ Setup Environment Variables
Create a .env file in the root directory and define the following:
```PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key```

4️⃣ Run the Application
Development Mode (with auto-restart):
```vercel dev```

Production Mode:
```vercel```

✅ API Endpoints
| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| POST   | `/api/login`  | User Login         |
| POST   | `/api/signup` | User Registration  |
| GET    | `/api/health` | Health Check Route |

Add more endpoint documentation as needed.


📚 Scripts
| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm start`     | Start the server (Production)  |
| `npm run dev`   | Start server in dev mode       |
| `npm run build` | Build step (Not required)      |
| `npm test`      | Run tests (No tests specified) |
