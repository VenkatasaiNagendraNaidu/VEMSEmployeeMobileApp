const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const connection = require('./db');  // Import the db connection
require('dotenv').config();  // Load environment variables

const app = express();

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Nodemailer setup to send emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL, 
        pass: process.env.PASSWORD    
    }
});

// Email template with Accept and Reject buttons
const htmlTemplate = (driverName, email, phoneNumber, password) => `
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        
        <!-- Header Section -->
        <div style="padding: 20px; background: linear-gradient(to right, #007bff, #00d4ff); text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <div style="display: flex; align-items: center; justify-content: center;">
                <img src="https://res.cloudinary.com/dalzs7bc2/image/upload/v1725259921/logo_ksostb.png" alt="Company Logo" style="max-width: 80px; border-radius: 10px; background-color: #ffffff; padding: 5px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); margin-right: 15px;">
                <h2 style="color: #fff; margin: 0; font-size: 24px; display: inline;">New Admin Registered</h2>
            </div>
        </div>

        <!-- Content Section -->
        <div style="padding: 20px;">
            <p style="font-size: 16px; line-height: 1.6;"><strong>Name:</strong> ${driverName}</p>
            <p style="font-size: 16px; line-height: 1.6;">
                <strong>Email:</strong> <span style="word-wrap: break-word; overflow-wrap: break-word;">${email}</span> 
                <strong>Phone Number:</strong> ${phoneNumber}
            </p> 
            <p style="font-size: 16px; line-height: 1.6;"><strong>Password:</strong> ${password}</p>
            <p style="font-size: 16px; line-height: 1.6;">Please review the registration:</p>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 20px;">
                <a href="http://localhost:5000/admin/accept?email=${email}" style="display: inline-block; background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); transition: background-color 0.3s ease;">
                    Accept
                </a>
                <a href="http://localhost:5000/admin/reject?email=${email}" style="display: inline-block; background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); transition: background-color 0.3s ease;">
                    Reject
                </a>
            </div>
        </div>

        <!-- Footer Section -->
        <div style="margin-top: 30px; padding: 20px; font-size: 14px; color: #777; text-align: center; background-color: #f9f9f9; border-top: 1px solid #dddddd;">
            <p style="margin: 0;">Thank you,</p>
            <p style="margin: 5px 0 10px;">VTS Support Team</p>
            <p style="margin: 0;">
                <a href="mailto:hr@vtshrteam.com" style="color: #007bff; text-decoration: none;">hr@vtshrteam.com</a> | +91 9141725777
            </p>
        </div>
    </div>
</body>


`;
const acceptEmailTemplate = (name) => `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="padding: 20px; background: linear-gradient(to right, #28a745, #6fdc8a); text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                <h2 style="color: #fff; margin: 0;">Congratulations!</h2>
            </div>
            <div style="padding: 20px;">
                <h3 style="font-size: 20px; margin: 0;">Hello ${name},</h3>
                <p style="font-size: 16px; line-height: 1.6;">You have been accepted as an admin for the Driver Portal.</p>
                <p style="font-size: 16px; line-height: 1.6;">We are excited to have you on board!</p>
                <div style="margin-top: 20px; text-align: center;">
                    <a href="http://localhost:5000/driver-portal" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Access the Portal</a>
                </div>
            </div>
            <div style="padding: 20px; font-size: 14px; color: #777; text-align: center;">
                <p>Thank you,</p>
                <p>The Driver Portal Team</p>
            </div>
        </div>
    </body>
`;


const rejectEmailTemplate = (name) => `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; padding: 20px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="padding: 20px; background: linear-gradient(to right, #dc3545, #f4a6a8); text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                <h2 style="color: #fff; margin: 0;">Application Update</h2>
            </div>
            <div style="padding: 20px;">
                <h3 style="font-size: 20px; margin: 0;">Hello ${name},</h3>
                <p style="font-size: 16px; line-height: 1.6;">Unfortunately, your request to become an admin for the Driver Portal has been rejected.</p>
                <p style="font-size: 16px; line-height: 1.6;">Thank you for your interest, and we wish you all the best in your future endeavors.</p>
                <div style="margin-top: 20px; text-align: center;">
                   <a href="http://localhost:5000/" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Return to Homepage</a>
                </div>
            </div>
            <div style="padding: 20px; font-size: 14px; color: #777; text-align: center;">
                <p>Thank you,</p>
                <p>The Driver Portal Team</p>
            </div>
        </div>
    </body>
`;

// Function to send an email
async function sendMail(toEmail, subject, htmlContent) {
    const info = await transporter.sendMail({
        from: process.env.USER_EMAIL,  
        to: toEmail,                   
        subject: subject,
        html: htmlContent
    });
    return info.messageId;
}

// Endpoint to register an admin (send review email and insert into database)
app.post('/register', (req, res) => {
    const { name, email, phoneNumber } = req.body;
    const randomPassword = Math.random().toString(36).slice(-8);  

    // Insert admin registration details into the database
    const sql = `INSERT INTO admins (name, email, phoneNumber, password) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [name, email, phoneNumber, randomPassword], (err, results) => {
        if (err) {
            return res.status(500).send('Database error: ' + err);
        }
        
        // Send review email with Accept/Reject buttons
        sendMail('medapati60@gmail.com', "New Admin Registered", htmlTemplate(name, email, phoneNumber, randomPassword))
            .then(messageId => res.status(200).send(`Email sent for review. ID: ${messageId}`))
            .catch(err => res.status(500).send('Error sending review email: ' + err));
    });
});

// Endpoint for Accepting the admin registration
app.get('/admin/accept', (req, res) => {
    const email = req.query.email;
    const name = "Admin";  // Replace with actual admin name if needed

    // Update the admin status to "accepted" (1) in the database
    const sql = `UPDATE admins SET status = 1 WHERE email = ?`;
    connection.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Database error: ' + err);
        }

        // Send acceptance email to the user
        sendMail(email, "Admin Approval", acceptEmailTemplate(name))
            .then(messageId => {
                res.status(200).send(`
                   <h2>Admin accepted successfully</h2>
                   <p>An approval email has been sent to ${email}.</p>
                `);
            })
            .catch(err => {
                res.status(500).send('Error sending acceptance email: ' + err);
            });
    });
});

// Endpoint for Rejecting the admin registration
app.get('/admin/reject', (req, res) => {
    const email = req.query.email;
    const name = "Admin";  // Replace with actual admin name if needed

    // Update the admin status to "rejected" (0) in the database
    const sql = `UPDATE admins SET status = 0 WHERE email = ?`;
    connection.query(sql, [email], (err, results) => {
        if (err) {
            return res.status(500).send('Database error: ' + err);
        }

        // Send rejection email to the user
        sendMail(email, "Admin Rejection", rejectEmailTemplate(name))
            .then(messageId => {
                res.status(200).send(`
                   <h2>Admin rejected successfully</h2>
                   <p>A rejection email has been sent to ${email}.</p>
                `);
            })
            .catch(err => {
                res.status(500).send('Error sending rejection email: ' + err);
            });
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
