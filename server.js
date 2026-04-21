const express = require('express');
const cors = require('cors');
const ayahRoutes = require('./routes/ayahRoutes');
const similarityRoutes = require('./routes/similarityRoutes');
const authRoutes = require('./routes/authRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/ayah', ayahRoutes);
app.use('/api/similarity', similarityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));