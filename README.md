# ⚡ NeXora

> **Next-Gen Dynamic Interactive Web Application Platform**

![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java 17](https://img.shields.io/badge/Java%2017-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

NeXora is a high-performance, modern full-stack web application designed for dynamic user experiences, combining fluid UI micro-interactions (GSAP & Framer Motion) with a robust Spring Boot backend.

---

## ✨ Features

* **🎨 Ultra-Smooth Motion Design**: Integrated GSAP & Framer Motion for high-frame-rate web animations.
* **🚀 Lightning Fast Frontend**: Built on React 19 and Vite for instant HMR and quick build times.
* **🛡️ Secure Enterprise Backend**: Spring Boot REST API service utilizing Java 17 features.
* **📱 Responsive & Modern UI**: Tailored with clean CSS architecture and Lucide icons.

---

## 📁 Repository Structure

```
NeXora/
├── frontend/             # React 19 + Vite Frontend
│   ├── src/              # Components, pages, animation hooks
│   ├── index.html        # HTML entry point
│   ├── vite.config.js    # Vite bundler config
│   └── package.json      # Dependencies (Framer Motion, GSAP, Lucide)
│
└── backend/              # Spring Boot Backend Service
    ├── src/              # Controllers, services, data models
    ├── pom.xml           # Maven project descriptor (Java 17, Spring Boot 3.5)
    └── README.md
```

---

## 🛠️ Quick Start

### 1. Frontend Setup (`frontend`)

```bash
# Navigate to frontend folder
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

### 2. Backend Setup (`backend`)

```bash
# Navigate to backend folder
cd backend

# Compile & run Spring Boot application
mvn clean spring-boot:run
```

The backend API will run at `http://localhost:8080`.

---

## 🧰 Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Framer Motion, GSAP, Lucide React, JavaScript (ESNext) |
| **Backend** | Java 17, Spring Boot 3, Maven |
| **Styling** | Modern CSS, Dynamic Layouts |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

[MIT](LICENSE)
