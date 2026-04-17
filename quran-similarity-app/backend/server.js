const express = require('express');
const cors = require('cors');
const ayahRoutes = require('./routes/ayahRoutes');
const similarityRoutes = require('./routes/similarityRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ayah', ayahRoutes);
app.use('/api/similarity', similarityRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// Error Handler (MUST be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});