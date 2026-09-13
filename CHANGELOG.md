# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - Production Release Candidate

### Added
- **Core eCommerce Features**: User authentication, product catalog, cart, and checkout flow.
- **Admin Dashboard**: Comprehensive ERP system for managing products, inventory, categories, brands, and users.
- **Inventory Management**: Real-time stock tracking, automated deductions upon order placement, and low-stock alerts.
- **Coupons & Promotions**: Dynamic discount system with percentage and fixed amount deductions.
- **Customer Dashboard**: Profile management, order tracking, support ticket history, and wishlists.
- **Reviews & Ratings**: Verified purchase product review system.
- **Payments**: Razorpay integration for online payments and webhook processing.
- **Notifications & Emails**: Nodemailer integration and automated PDF invoice generation.

### Security & DevOps
- Integrated `helmet` and `cors` for API security.
- Implemented `express-rate-limit` for global and specific route protection (Auth, Payments).
- Integrated Winston for advanced error and application logging.
- Created GitHub Actions CI/CD workflows for automated builds.
- Created `Dockerfile` and `docker-compose.yml` for containerized environments.
- Developed `/api/health` monitoring endpoint.
- Created MongoDB automated backup bash scripts.
