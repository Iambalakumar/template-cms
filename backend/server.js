const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.config.js');
const dotenv = require('dotenv');
const templatesRoute = require('./routes/template');
const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const mongoose = require('mongoose');

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/api/templates', templatesRoute);

const PORT = process.env.PORT || 5000;


// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

