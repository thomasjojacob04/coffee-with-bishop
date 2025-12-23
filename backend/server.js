require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const registrationRoutes = require('./routes/registrations');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware - CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://*.vercel.app', // Allow all Vercel deployments
    'https://coffee-with-bishop.vercel.app', // Add your actual Vercel URL here after deployment
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Coffee with Bishop API', 
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/login',
      registrations: '/api/registrations'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});