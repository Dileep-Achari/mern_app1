const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')

const app = express();
const port = 3000;
//app.use(cors())

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// User schema
const userSchema = new mongoose.Schema({
    emailID: String,
    firstName: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

// Register API
app.post('/register', async (req, res) => {
    const { emailID, firstName, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        emailID,
        firstName,
        password: hashedPassword,
    });

    await newUser.save();

    res.send('Registered successfully');
});

// Login API
app.post('/login', async (req, res) => {
    const { emailID, password } = req.body;

    const user = await User.findOne({ emailID });

    if (!user) {
        return res.status(400).send('INVALID CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).send('INVALID CREDENTIALS');
    }

    res.send('Logged in successfully');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
