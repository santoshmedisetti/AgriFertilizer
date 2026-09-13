# Database Schema (MongoDB / Mongoose)

Below is an overview of the core collections and relationships mapping the Agriftilizer platform.

## 1. User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, hashed)
- `role` (Enum: ['user', 'admin'], default: 'user')
- `avatar` (String, url)

## 2. Product
- `name` (String, required)
- `slug` (String, unique, index)
- `description` (String)
- `price` (Number)
- `category` (ObjectId -> Category)
- `brand` (ObjectId -> Brand)
- `images` ([String])
- `countInStock` (Number)
- `rating` (Number, default: 0)
- `numReviews` (Number, default: 0)

## 3. Order
- `user` (ObjectId -> User)
- `orderNumber` (String, unique)
- `orderItems` (Array of subdocs: product, name, qty, image, price)
- `shippingAddress` (Subdoc: fullName, street, city, state, pinCode, phone)
- `paymentMethod` (Enum: ['Razorpay', 'COD'])
- `itemsPrice`, `taxPrice`, `shippingPrice`, `discount`, `totalPrice` (Number)
- `isPaid` (Boolean), `paidAt` (Date)
- `isDelivered` (Boolean), `deliveredAt` (Date)
- `status` (Enum: Pending, Confirmed, Packed, Shipped, Out for Delivery, Delivered, Cancelled)
- `statusHistory` (Array of status updates with timestamps)

## 4. Payment
- `orderId` (ObjectId -> Order)
- `userId` (ObjectId -> User)
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature` (String)
- `amount` (Number), `currency` (String)
- `paymentMethod`, `paymentStatus` (Enum: Pending, Completed, Failed, Refunded)

## 5. Review
- `productId` (ObjectId -> Product)
- `userId` (ObjectId -> User)
- `orderId` (ObjectId -> Order)
- `rating` (Number 1-5)
- `comment` (String)
- `verifiedPurchase` (Boolean)
- `status` (Enum: Pending, Approved, Rejected)

## 6. Inventory & StockTransaction
- `productId` (ObjectId -> Product)
- `currentStock`, `minimumStock` (Number)
- `stockHistory` (Array of transactions)
- **StockTransaction**: `product`, `quantity`, `transactionType` (Stock In/Out), `admin` (ObjectId).

## Entity Relationship Summary
1. `User` 1:* `Order`
2. `User` 1:* `Review`
3. `User` 1:* `SupportTicket`
4. `Product` 1:1 `Inventory`
5. `Product` 1:* `Review`
6. `Order` 1:1 `Payment`
7. `Category` 1:* `Product`
