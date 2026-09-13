# Deployment Guide

Follow this guide to deploy the MERN stack application to production using Vercel (Frontend) and Render (Backend).

## 1. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Whitelist all IP addresses (`0.0.0.0/0`) in Network Access for Render compatibility.
3. Get your connection string (URI). Ensure you replace `<password>` with your database user's password.

## 2. External Services Setup
- **Cloudinary**: Create an account. Retrieve `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- **Razorpay**: Create an account, switch to Live mode (or stay in Test mode). Retrieve `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`. Generate a `RAZORPAY_WEBHOOK_SECRET` for webhook validation.
- **Nodemailer (SMTP)**: Use a service like SendGrid, AWS SES, or Brevo. Retrieve SMTP Host, Port, User, and Pass.

## 3. Backend Deployment (Render)
1. Push your code to GitHub.
2. Sign up on [Render.com](https://render.com/).
3. Create a new **Web Service**.
4. Connect your GitHub repository.
5. Set the Root Directory to `server`.
6. **Build Command**: `npm install`
7. **Start Command**: `node server.js`
8. **Environment Variables**: Add all variables from your local `.env`:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `MONGO_URI=<Your Atlas URI>`
   - `JWT_SECRET=<Your strong secret>`
   - `CLOUDINARY_*` keys
   - `RAZORPAY_*` keys
   - `SMTP_*` keys
   - `FRONTEND_URL=<Your Vercel URL>`

## 4. Frontend Deployment (Vercel)
1. Sign up on [Vercel](https://vercel.com/).
2. Create a New Project and import your GitHub repository.
3. Set the Root Directory to `client`.
4. Vercel will auto-detect Vite. Leave Build command as `npm run build`.
5. **Environment Variables**:
   - `VITE_API_URL=<Your Render Backend URL>`
   - `VITE_RAZORPAY_KEY_ID=<Your Razorpay Key>`
6. Deploy.
