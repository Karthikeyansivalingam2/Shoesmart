# ShoeSmart — MERN E-commerce Platform

A full-stack footwear shopping application demonstrating product discovery, cart management, authentication, checkout, and admin workflows.

## Features

### Customer experience
- Browse footwear products in a responsive storefront
- Add products to a persistent shopping cart
- Register and sign in
- Complete checkout using Razorpay
- View order history and order status

### Admin experience
- Dashboard for store activity
- Create, update, and delete product listings
- Manage customer orders and update order status

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| Payments | Razorpay |
| Image management | Cloudinary |
| Animations | Framer Motion |

## Project Structure

```text
shoesmart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
└── frontend/
    ├── src/
    ├── public/
    └── index.html
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Karthikeyansivalingam2/Shoesmart.git
cd Shoesmart
```

Install dependencies separately in the backend and frontend folders:

```bash
cd backend
npm install
```

Configure the backend's required environment variables locally (MongoDB connection, JWT secret, Razorpay and Cloudinary credentials). Never commit real credentials.

Start the backend using the script defined in its `package.json`.

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite.

## Security Notes
- Keep secret keys on the server, never in frontend code.
- Use test credentials when developing payment flows.
- Validate and authorize protected backend routes.

## Author
**Karthikeyan S.** · [GitHub Profile](https://github.com/Karthikeyansivalingam2)
