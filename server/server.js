
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./Routes/expenseRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/expenses', expenseRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Expense Tracker API');
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // Here you would typically check the username and password against a database
    if (username === 'user' && password === 'password') {
        res.json({ message: 'Login successful', user: { username } });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }

})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
