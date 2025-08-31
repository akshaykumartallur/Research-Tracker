const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/auth');
const patentRoutes = require('./routes/patent');
const publicationRoutes = require('./routes/publication');
const eventRoutes = require('./routes/events');
const conferenceRoutes = require('./routes/conferences');
const contributorsRoutes = require('./routes/topContributors');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(bodyParser.json());  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patents', patentRoutes);
app.use('/api/publications', publicationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/conferences',conferenceRoutes)
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/admin', contributorsRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
