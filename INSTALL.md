# Installation Guide

Follow these steps to set up the Agriftilizer platform locally for development.

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or Atlas URI)
- Git
- Docker & Docker Compose (Optional, for containerized development)

## Standard Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd Agriftilizer
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install --legacy-peer-deps
   
   # Create a .env file and populate it with required variables
   cp .env.example .env 
   
   # Start the development server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   
   # Create a .env file
   echo "VITE_API_URL=http://localhost:5000" > .env
   
   # Start the Vite development server
   npm run dev
   ```

## Docker Compose Setup (Alternative)

If you have Docker installed, you can spin up the entire stack (MongoDB, Backend, Frontend) with a single command.

1. Ensure `.env` is created inside the `server` directory.
2. From the root directory (`/Agriftilizer`), run:
   ```bash
   docker-compose up --build
   ```
3. The application will be available at `http://localhost:5173`.

## Environment Variables (.env)
The `server/.env` file requires the following configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/agriftilizer
JWT_SECRET=your_super_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# SMTP (Nodemailer)
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```
