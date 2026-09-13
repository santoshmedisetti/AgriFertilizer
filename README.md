# Agriftilizer - MERN Fertilizer Booking System

Agriftilizer is a comprehensive, enterprise-grade E-Commerce platform built exclusively for agricultural products, specifically fertilizers. Developed using the MERN stack (MongoDB, Express, React, Node.js), it features an expansive feature set designed for modern agricultural businesses.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit (RTK Query), Framer Motion, Recharts
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth
- **Services:** Razorpay (Payments), Cloudinary (Image Hosting), Nodemailer (Emails), PDFKit (Invoices)

## Key Features
- **Authentication & Authorization**: Secure JWT-based auth with explicit Role-Based Access Control (Admin/Customer).
- **Product & Inventory Management**: Dynamic stock tracking, low-stock alerts, out-of-stock blocking, category/brand mappings.
- **Cart & Checkout**: Redux-persisted cart, coupon validation, multiple payment methods (Razorpay/COD).
- **Order Lifecycle**: Real-time order tracking, automated email updates, PDF invoice generation.
- **Customer Dashboard**: Payment history, support tickets, order tracking, profile management, and reviews.
- **Admin ERP Dashboard**: Advanced data visualization, KPI aggregations, review moderation, and full entity CRUD operations.

## Local Setup Instructions

1. **Clone & Install Dependencies**
   ```bash
   git clone <repo-url>
   cd Agriftilizer
   
   # Install server dependencies
   cd server
   npm install --legacy-peer-deps
   
   # Install client dependencies
   cd ../client
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `server` directory (see `docs/DEPLOYMENT_GUIDE.md` for required keys).

3. **Run the Application**
   ```bash
   # Terminal 1 (Backend)
   cd server
   npm run dev

   # Terminal 2 (Frontend)
   cd client
   npm run dev
   ```

## Documentation
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
