# REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Authenticate user & get token | No |
| POST | `/register` | Register a new user | No |
| POST | `/logout` | Clear cookie | Yes |
| GET | `/profile` | Get user profile | Yes |

## Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products (paginated/filtered) | No |
| GET | `/:id` | Get product by ID | No |
| POST | `/` | Create a product | Yes (Admin) |
| PUT | `/:id` | Update a product | Yes (Admin) |

## Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create an order | Yes |
| GET | `/myorders` | Get logged-in user orders | Yes |
| GET | `/:id` | Get order details | Yes |
| PUT | `/:id/status` | Update order status | Yes (Admin) |

## Payment (`/api/payment`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/create-order` | Init Razorpay order | Yes |
| POST | `/verify` | Verify payment signature | Yes |
| POST | `/webhook` | Razorpay webhook | No |

## Notifications (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user notifications | Yes |
| PUT | `/:id/read` | Mark read | Yes |

## Support (`/api/support`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user tickets | Yes |
| POST | `/` | Create ticket | Yes |
| POST | `/:id/reply` | Reply to ticket | Yes |

## Invoice (`/api/invoice`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:orderId` | Download PDF | Yes |
