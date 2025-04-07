# Quicko - E-Commerce Platform

Quicko is a full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and integrated with Stripe for secure online payments.

## Features

- **User Authentication**: Secure login and registration system
- **Product Management**: Browse products by categories and subcategories
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout Process**: Secure checkout with multiple payment options
  - Cash on Delivery
  - Online Payment (Stripe)
- **Order Management**: Track and manage orders
- **User Dashboard**: View profile, orders, and manage addresses
- **Admin Panel**: Manage products, categories, and view orders
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Stripe API for payment processing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Stripe account (for payment processing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/quicko.git
cd quicko
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

3. Set up environment variables

Create a `.env` file in the Backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the Frontend directory with the following variables:
```
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. Start the development servers
```bash
# Start backend server
cd Backend
npm run dev

# Start frontend server (in a new terminal)
cd Frontend
npm run dev
```

5. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Deployment

### Backend Deployment
1. Set up a MongoDB Atlas database
2. Deploy to a platform like Heroku, Render, or Railway
3. Configure environment variables on the deployment platform

### Frontend Deployment
1. Build the frontend application
```bash
cd Frontend
npm run build
```
2. Deploy to a platform like Vercel, Netlify, or GitHub Pages
3. Configure environment variables on the deployment platform

## Project Structure

```
quicko/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── route/
│   ├── utils/
│   ├── .env
│   ├── index.js
│   └── package.json
├── Frontend/
│   ├── assets/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── provider/
│   ├── store/
│   ├── utils/
│   ├── .env
│   ├── index.html
│   ├── main.jsx
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React Icons](https://react-icons.github.io/react-icons/) for icons 