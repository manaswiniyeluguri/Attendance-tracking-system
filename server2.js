const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

// Twilio credentials (replace with your own)
const accountSid = 'AC59a96b606f48fa30b62 564';
const authToken = '0a9337653521b3c8f 44';
const twilioPhoneNumber = '+186564042358';

const app = express();
const port = 4004;

app.use(cors());
app.use(bodyParser.json());

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: 'ravitejapallakonda753@gmail.com', // your email
        pass: 'arga zutb wvjd ktbw ttt' // your email password or app password
    }
});

// Endpoint to handle sending the OTP
app.post('/sendOTP', async (req, res) => {
    const { email, phone, message } = req.body;

    try {
        // Send email
        const mailOptions = {
            from: 'ravitejapallakond@gmail.com',
            to: email,
            subject: 'Fine Notification',
            text: message
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent');  // This will display in the terminal if the email is sent successfully

        // Send SMS using Twilio
        const client = twilio(accountSid, authToken);
        await client.messages.create({
            body: message,
            from: '+18457676323',
            to: '+9146876453834'

        });
        console.log('SMS sent'); // This will display if the SMS is sent successfully

        res.status(200).send('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error); // Displays error details if there's an issue
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
