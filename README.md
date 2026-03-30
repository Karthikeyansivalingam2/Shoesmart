# 👟 ShoeSmart - Advanced MERN E-commerce Platform

ShoeSmart is a high-performance, full-stack e-commerce application designed for a premium footwear shopping experience. This project demonstrates a robust implementation of the **MERN stack (MongoDB, Express, React, Node.js)** with advanced features like real-time admin dashboards, secure payments, and cloud-based image handling.

> [!NOTE]
> **Project Purpose:** This application was built to showcase advanced concepts in full-stack development, intended for academic and professional portfolio presentation.

---

## 🎨 Design Philosophy
The ShoeSmart experience is built around **Rich Aesthetics** and **Dynamic User Interaction**.
*   **Vibrant Dark/Light Modes:** A sleek, high-contrast interface designed for premium branding.
*   **Micro-animations:** Powered by `framer-motion` to provide a "premium feel" during page transitions.
*   **Responsive Architecture:** Fully optimized for Mobile, Tablet, and Desktop users.

---

## 🚀 Key Features

### 🛒 Customer Experience
*   **Modern Storefront:** Browse products with high-quality images and dynamic pricing.
*   **Advanced Cart System:** State-managed shopping cart that persists across navigation.
*   **Secure Checkout:** Integrated with **Razorpay** for seamless UPI and Card payments.
*   **Order Tracking:** Users can view their real-time order history and status in their profile.
*   **Account Protection:** Secure JWT-based login and signup with `bcryptjs` encryption.

### 🛡️ Admin Powerhouse
*   **Central Dashboard:** At-a-glance view of total revenue, active orders, and user growth.
*   **Inventory (CRUD):** Interface to **Create**, **Read**, **Update**, and **Delete** products.
*   **Order Management:** Track and update the status of customer orders directly from the database.

---

## 📂 Project Structure
```text
shoesmart/
├── backend/            # Express Server Core (MVC Pattern)
│   ├── config/         # DB & Environment Config
│   ├── controllers/    # Business Logic
│   ├── models/         # Mongoose Schemas (User, Product, Order)
│   ├── routes/         # API Endpoints
│   └── index.js        # Entry Point
└── frontend/           # React Application (Vite)
    ├── src/            # Components, Hooks, Context (Tailwind CSS 4)
    ├── public/         # Static Assets
    └── index.html      # SPA Template
```

---

## 📊 Technical Analysis (In-Depth)

### **1. System Architecture**
- **Frontend:** SPA (Single Page Application) built with **React 19 (Vite)**.
- **Backend:** REST API built with **Node.js** and **Express.js**.
- **Database:** **MongoDB** (Cloud Atlas), using **Mongoose** for type-safe interaction.
- **Image Hosting:** **Cloudinary** for efficient product image management.

### **2. Security & Authentication**
- **JWT Protection:** Protected routes (like `/api/admin`) require a valid JWT token.
- **Password Security:** `bcryptjs` is used for 10-round salting/hashing.
- **CORS:** Restricts API access to authorized domains for production security.

### **3. Transaction Flow (Razorpay)**
- The application requests an `OrderID` from the backend, which interacts with the Razorpay API.
- Upon successful payment, the database state is updated (`isPaid: true`) and a confirmation is shown.

---

## 🛠️ Installation & Setup

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/Karthikeyansivalingam2/shoesmart.git
   ```

2. **Backend Config:**
   - Go to `backend/`
   - Create `.env` file with `MONGO_URI`, `JWT_SECRET`, `RAZORPAY_KEY`, etc.
   - Run `npm install` then `npm start`

3. **Frontend Config:**
   - Go to `frontend/`
   - Run `npm install` then `npm run dev`

---

## 👤 Credits
**Developed by: Karthikeyan S.**
*Student Portfolio Project - 2026*
