# Flower Server

REST API backend for an online flower shop - managing flowers catalog, user accounts, and bouquet orders.

## Tech Stack

- **Runtime:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JWT + bcrypt, Google OAuth (Passport.js)
- **Validation:** Joi
- **File Upload:** Multer
- **Email:** Nodemailer

## Project Structure

```
flowerServer/
├── App.js                  # Entry point - Express server setup
├── config/
│   └── db.js               # MongoDB connection
├── models/
│   ├── user.js             # User schema
│   ├── product.js          # Flower/product schema
│   └── order.js            # Order/bouquet schema
├── controller/
│   ├── user.js             # User business logic
│   ├── product.js          # Product CRUD operations
│   └── order.js            # Order management
├── routes/
│   ├── user.js             # /api/user endpoints
│   ├── product.js          # /api/product endpoints
│   └── order.js            # /api/order endpoints
├── middlewares/
│   ├── check.js            # JWT authentication
│   └── image.js            # Image upload handling
├── utils/
│   ├── jwt.js              # Token generation
│   └── email.js            # Email utility
├── validations/
│   └── productValidation.js
└── public/                 # Uploaded flower images
```

## Setup

### Prerequisites

- Node.js
- MongoDB instance

### Environment Variables

Create a `.env` file:

```env
PORT=3000
DB_URL=mongodb://localhost:27017/flowerShop
SECRET_KEY=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_SECRET=your_google_secret
```

### Installation

```bash
npm install
node App.js
```

## API Endpoints

### Users (`/api/user`)

| Method | Endpoint          | Description             | Auth |
|--------|-------------------|-------------------------|------|
| POST   | `/`               | Register                | -    |
| POST   | `/login`          | Login                   | -    |
| POST   | `/google`         | Google OAuth login      | -    |
| POST   | `/signUpWithGoogle`| Google OAuth register  | -    |
| GET    | `/`               | Get all users           | -    |
| GET    | `/:id`            | Get user by ID          | -    |
| PUT    | `/:id`            | Update user             | -    |
| PUT    | `/updatePassword` | Change password         | JWT  |

### Products (`/api/product`)

| Method | Endpoint      | Description              | Auth  |
|--------|---------------|--------------------------|-------|
| GET    | `/`           | Get flowers (paginated)  | -     |
| GET    | `/getNumPage` | Get total count/pages    | -     |
| GET    | `/:id`        | Get flower by ID         | -     |
| POST   | `/`           | Add flower               | Admin |
| PUT    | `/:id`        | Update flower            | Admin |
| DELETE | `/:id`        | Delete flower (soft)     | Admin |

### Orders (`/api/order`)

| Method | Endpoint | Description           | Auth |
|--------|----------|-----------------------|------|
| GET    | `/`      | Get all orders        | -    |
| GET    | `/:id`   | Get orders by user ID | -    |
| POST   | `/`      | Create order          | -    |
| PUT    | `/:id`   | Mark as sent          | -    |
| DELETE | `/:id`   | Delete order          | -    |

## Data Models

### User
- `email`, `userName`, `password` (hashed), `role` (USER/ADMIN), `registrationDate`

### Product (Flower)
- `name`, `description`, `img`, `price`, `pickDate`, `shelfLife`, `needSun`, `existColors[]`, `isExist`

### Order
- `orderDate`, `deadline`, `customerCode` (ref: User), `shipAddress`, `bouquet[]` (flower + color + amount), `isSent`, `sendPrice`, `totalPrice`

## Auth

- JWT tokens (1h expiration) generated on login
- Admin-only routes protected via middleware
- Passwords hashed with bcrypt
- Google OAuth supported via Passport.js
