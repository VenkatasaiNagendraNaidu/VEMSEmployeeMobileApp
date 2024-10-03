const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const route = express.Router();      
const db = require('../db');
const async = require('async');

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'harshit995905@gmail.com',
        pass: 'syyk rung ljrm arce',
    },
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Uploads directory created.');
}

// Multer for file uploads
const upload = multer({ dest: uploadsDir });

// Function to generate random EmployeePassword
const generateRandomPassword = (length = 6) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// upload Excel file and add employee data
route.post('/upload', upload.single('file'), (req, res) => {
    const filePath = path.join(uploadsDir, req.file.filename);
    
    const workbook = xlsx.readFile(filePath);
    const sheet_name = workbook.SheetNames[0];
    const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

    // Create the EmployeeDetails table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS EmployeeDetails (
            EmployeeId VARCHAR(100) PRIMARY KEY, 
            EmployeeName VARCHAR(200), 
            EmployeeGender VARCHAR(20), 
            EmployeeAddress VARCHAR(255),  
            EmployeeCity VARCHAR(100), 
            EmployeeLatitude VARCHAR(100), 
            EmployeeLongitude VARCHAR(100), 
            EmployeeEmail VARCHAR(100), 
            EmployeeContact VARCHAR(20), 
            EmployeeEmergencyContact VARCHAR(20), 
            EmployeePassword VARCHAR(100),
            EmployeeImage VARCHAR(255)
        );
    `;

    // Create the table first
    db.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Table created or already exists.');
    });

    // Insert data into the table immediately
    sheet.forEach(row => {
        const EmployeePassword = generateRandomPassword(); // Generate password once

        // Inserting data including the generated password
        const query = `
            INSERT INTO EmployeeDetails 
            (EmployeeId, EmployeeName, EmployeeGender, EmployeeAddress, EmployeeCity, EmployeeLatitude, EmployeeLongitude, EmployeeEmail, EmployeeContact, EmployeeEmergencyContact, EmployeePassword, EmployeeImage) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            EmployeeName = VALUES(EmployeeName),
            EmployeeGender = VALUES(EmployeeGender),
            EmployeeAddress = VALUES(EmployeeAddress),
            EmployeeCity = VALUES(EmployeeCity),
            EmployeeLatitude = VALUES(EmployeeLatitude),
            EmployeeLongitude = VALUES(EmployeeLongitude),
            EmployeeEmail = VALUES(EmployeeEmail),
            EmployeeContact = VALUES(EmployeeContact),
            EmployeeEmergencyContact = VALUES(EmployeeEmergencyContact),
            EmployeePassword = VALUES(EmployeePassword),
            EmployeeImage = VALUES(EmployeeImage)
        `;

        const values = [
            row.EmployeeId,
            row.EmployeeName,
            row.EmployeeGender,
            row.EmployeeAddress,
            row.EmployeeCity,
            row.EmployeeLatitude,
            row.EmployeeLongitude,
            row.EmployeeEmail,
            row.EmployeeContact,
            row.EmployeeEmergencyContact,
            EmployeePassword, // Storing the generated password
            row.EmployeeImage
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting data into MySQL:', err);
            } else {
                console.log('Data inserted/updated successfully.');
            }
        });

        // Store the password in the row for later use in the email
        row.EmployeePassword = EmployeePassword;
    });

    // Send response to frontend after data is inserted
    res.send('File uploaded and mails are being processed.');

    // Now process the emails using async queue
    const emailQueue = async.queue((row, callback) => {
        const mailOptions = {
            from: 'harshit995905@gmail.com',
            to: row.EmployeeEmail,
            subject: 'Registration Confirmation - Account Details',
            html:`<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                            <div style="max-width: 700px; margin: 40px auto; background-color: #5bb450">
                                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                    
                                    <div style="background-color: #5bb450; padding: 20px; border-radius: 8px 8px 0 0;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;text-align: center; font-weight: bold">Registration Confirmation</h1>
                                    </div>
                                    
                                    <div style="padding: 20px; color: #333333; text-align: left;">
                                        <p style="line-height: 1.6;">Dear ${row.EmployeeName},</p>
                                        <p style="line-height: 1.6;">We are pleased to inform you that your employee details have been successfully updated in our records.</p>
                                        <p style="line-height: 1.6;">Here are your account details:</p>
                                        <p style="line-height: 1.6; margin: 0;"><strong>Employee ID:</strong> ${row.EmployeeId}</p>
                                        <p style="line-height: 1.6; margin: 0;"><strong>Password:</strong> ${row.EmployeePassword}</p>
                                        <p style="line-height: 1.6; margin-top: 20px;">Please ensure to change your password after logging in for the first time.</p>
                                        <p style="line-height: 1.6;">Best regards,</p>
                                        <p style="line-height: 1.0;"><strong>VEMS Support Team</strong></P>
                                        <p style="line-height: 1.0;">Contact No: 74166 33125</p>
                                        <p style="line-height: 1.0;">Email ID: vems-support@gmail.com</p>
                                    </div>
                                    
                                    <div style="padding: 20px; text-align: center; color: #aaaaaa; font-size: 12px;">
                                    <p>&copy; Copyright VTS Enterprises India Private Ltd, 2016</p>
                                    </div>
                                    
                                </div>
                            </div>
                        </body>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending Email:', error);
                callback(error);
            } else {
                console.log('Email sent:', info.response);
                callback();
            }
        });
    }, 1); // Process one email at a time (throttling)

    // Add emails to the queue
    sheet.forEach(row => {
        emailQueue.push(row, (err) => {
            if (err) {
                console.error('Error processing email for:', row.EmployeeId, row.EmployeeEmail, err);
            } else {
                console.log('Email processed for:',  row.EmployeeId, row.EmployeeEmail);
            }
        });
    });

    // When all emails are sent, delete the file
    emailQueue.drain(() => {
        console.log('All emails have been sent.');
        
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting the file:', err);
            } else {
                console.log('Uploaded file deleted.');
            }
        });
    });
});

// add employee form
route.post('/add-employee', (req, res) => {
    const {
        EmployeeImage,
        EmployeeId,
        EmployeeName,
        EmployeeGender,
        EmployeeAddress,
        EmployeeCity,
        EmployeeLatitude,
        EmployeeLongitude,
        EmployeeEmail,
        EmployeeContact,
        EmployeeEmergencyContact
    } = req.body;

    console.log(req.body)
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS EmployeeDetails (
            EmployeeId VARCHAR(100) PRIMARY KEY, 
            EmployeeName VARCHAR(200), 
            EmployeeGender VARCHAR(20), 
            EmployeeAddress VARCHAR(255),  
            EmployeeCity VARCHAR(100), 
            EmployeeLatitude VARCHAR(100), 
            EmployeeLongitude VARCHAR(100), 
            EmployeeEmail VARCHAR(100), 
            EmployeeContact VARCHAR(20), 
            EmployeeEmergencyContact VARCHAR(20), 
            EmployeePassword VARCHAR(100),
            EmployeeImage VARCHAR(255)
        );
    `;

    db.query(createTableQuery, (err, result) => {
        if (err) throw err;
        console.log('Table created or already exists.');
    });

    const EmployeePassword = generateRandomPassword();
            
            const query = `
                INSERT INTO EmployeeDetails 
                (EmployeeId, EmployeeName, EmployeeGender, EmployeeAddress, EmployeeCity, EmployeeLatitude, EmployeeLongitude, EmployeeEmail, EmployeeContact, EmployeeEmergencyContact, EmployeePassword, EmployeeImage) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                EmployeeName = VALUES(EmployeeName),
                EmployeeGender = VALUES(EmployeeGender),
                EmployeeAddress = VALUES(EmployeeAddress),
                EmployeeCity = VALUES(EmployeeCity),
                EmployeeLatitude = VALUES(EmployeeLatitude),
                EmployeeLongitude = VALUES(EmployeeLongitude),
                EmployeeEmail = VALUES(EmployeeEmail),
                EmployeeContact = VALUES(EmployeeContact),
                EmployeeEmergencyContact = VALUES(EmployeeEmergencyContact),
                EmployeePassword = VALUES(EmployeePassword),
                EmployeeImage = VALUES(EmployeeImage)
            `;

            const values = [
                EmployeeId,
                EmployeeName,
                EmployeeGender,
                EmployeeAddress,
                EmployeeCity,
                EmployeeLatitude,
                EmployeeLongitude,
                EmployeeEmail,
                EmployeeContact,
                EmployeeEmergencyContact,
                EmployeePassword,
                EmployeeImage
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error('Error inserting data into MySQL:', err);
                    res.status(500).send('Error saving data');
                } else {
                    console.log('Data inserted/updated successfully.');

                    const mailOptions = {
                        from: 'harshit995905@gmail.com',
                        to: EmployeeEmail,
                        subject: 'Registration Confirmation - Account Details',
                        html:`<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                                <div style="max-width: 700px; margin: 40px auto; background-color: #5bb450">
                                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                        
                                        <div style="background-color: #5bb450; padding: 20px; border-radius: 8px 8px 0 0;">
                                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;text-align: center; font-weight: bold">Registration Confirmation</h1>
                                        </div>
                                        
                                        <div style="padding: 20px; color: #333333; text-align: left;">
                                            <p style="line-height: 1.6;">Dear ${EmployeeName},</p>
                                            <p style="line-height: 1.6;">We are pleased to inform you that your employee details have been successfully updated in our records.</p>
                                            <p style="line-height: 1.6;">Here are your account details:</p>
                                            <p style="line-height: 1.6; margin: 0;"><strong>Employee ID:</strong> ${EmployeeId}</p>
                                            <p style="line-height: 1.6; margin: 0;"><strong>Password:</strong> ${EmployeePassword}</p>
                                            <p style="line-height: 1.6; margin-top: 20px;">Please ensure to change your password after logging in for the first time.</p>
                                            <p style="line-height: 1.6;">Best regards,</p>
                                            <p style="line-height: 1.0;"><strong>VEMS Support Team</strong></P>
                                            <p style="line-height: 1.0;">Contact No: 74166 33125</p>
                                            <p style="line-height: 1.0;">Email ID: vems-support@gmail.com</p>
                                        </div>
                                        
                                        <div style="padding: 20px; text-align: center; color: #aaaaaa; font-size: 12px;">
                                        <p>&copy; Copyright VTS Enterprises India Private Ltd, 2016</p>
                                        </div>
                                        
                                    </div>
                                </div>
                            </body>`,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending Email:', error);
                            res.status(500).send('Error sending Email');
                        } else {
                            console.log('Email sent:', info.response);
                            res.send('Employee added successfully and Email sent');
                        }
                        console.log(EmployeeId, EmployeeEmail);
                    });
                }
            });
});

//update employee by id
route.post('/updateemployee/:empId', (req, res) => {
    const empId = req.params.empId;
    const { 
        EmployeeName, 
        EmployeeGender, 
        EmployeeAddress, 
        EmployeeCity, 
        EmployeeLatitude, 
        EmployeeLongitude, 
        EmployeeContact, 
        EmployeeEmergencyContact
    } = req.body;

        // If no image file is provided, update employee data without changing the image
        const query = `
            UPDATE EmployeeDetails 
            SET 
                EmployeeName = ?, 
                EmployeeGender = ?, 
                EmployeeAddress = ?, 
                EmployeeCity = ?, 
                EmployeeLatitude = ?, 
                EmployeeLongitude = ?, 
                EmployeeContact = ?, 
                EmployeeEmergencyContact = ?
            WHERE EmployeeId = ?
        `;

        const values = [
            EmployeeName, 
            EmployeeGender, 
            EmployeeAddress, 
            EmployeeCity, 
            EmployeeLatitude, 
            EmployeeLongitude, 
            EmployeeContact, 
            EmployeeEmergencyContact,
            empId
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error updating employee details:', err);
                return res.status(500).send('Database update failed');
            }

            res.send({ message: 'Employee details updated successfully!' });
        });
});

//delete employee by id
route.post('/deleteemployee/:empId', (req, res) => {
    const empId = req.params.empId;
    const query = "DELETE FROM EmployeeDetails WHERE EmployeeId = ?";
    db.query(query, empId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Employee Deleted successfully!' });
    })
});

//show all employee details
route.get('/showemployee', (req, res) => {
    const query = "SELECT * FROM EmployeeDetails";
    db.query(query, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    })
});

//show all trip request details
route.get('/showtrips', (req, res) => {
    const query = "SELECT * FROM CabBookingTable";
    db.query(query, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    })
});


/*     Mobile View APIs      */
//login
route.post('/login', (req, res) => {
    const { empId, password } = req.body;
    const query = 'SELECT * FROM EmployeeDetails WHERE EmployeeId = ?';
    db.query(query, [empId], async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).send({ message: 'User not found!' });
      
      const user = results[0];
      const isValidPassword = (user.EmployeePassword === password);
      if (!isValidPassword) return res.status(401).send({ message: 'Invalid Password!'});
      res.send({ message: 'Login successful!', id: user.EmployeeId});
    });
});

//reset password mail
route.post('/reset-password', (req, res) => {
    const { EmployeeId } = req.body;

    const checkEmployeeQuery = 'SELECT * FROM EmployeeDetails WHERE EmployeeId = ?';
    db.query(checkEmployeeQuery, [EmployeeId], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const employee = results[0]; 
        const newPassword = generateRandomPassword();

        const updatePasswordQuery = 'UPDATE EmployeeDetails SET EmployeePassword = ? WHERE EmployeeId = ?';
        db.query(updatePasswordQuery, [newPassword, EmployeeId], (err, updateResult) => {
            if (err) {
                console.error('Error updating Password:', err);
                return res.status(500).json({ error: 'Error updating Password' });
            }

            const mailOptions = {
                from: 'harshit995905@gmail.com',
                to: employee.EmployeeEmail,
                subject: 'Password Reset Confirmation',
                html: `
                    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                        <div style="max-width: 700px; margin: 40px auto; background-color: #5bb450">
                            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                <div style="background-color: #5bb450; padding: 20px; border-radius: 8px 8px 0 0;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;text-align: center; font-weight: bold">
                                        Password Reset Confirmation
                                    </h1>
                                </div>
                                <div style="padding: 20px; color: #333333; text-align: left;">
                                    <p style="line-height: 1.6;">Dear ${employee.EmployeeName},</p>
                                    <p style="line-height: 1.6;">Your password has been reset successfully.</p>
                                    <p style="line-height: 1.6; margin: 0;">Your new password is: <strong>${newPassword}</strong></p>
                                    <p style="line-height: 1.6; margin-top: 20px;">Please log in and change your password.</p>
                                    <p style="line-height: 1.6;">Best regards,</p>
                                    <p style="line-height: 1.0;"><strong>VEMS Support Team</strong></P>
                                    <p style="line-height: 1.0;">Contact No: 74166 33125</p>
                                    <p style="line-height: 1.0;">Email ID: vems-support@gmail.com</p>
                                </div>
                                <div style="padding: 20px; text-align: center; color: #aaaaaa; font-size: 12px;">
                                    <p>&copy; Copyright VTS Enterprises India Private Ltd, 2016</p>
                                </div>
                            </div>
                        </div>
                    </body>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending Email:', error);
                    return res.status(500).json({ error: 'Failed to send Email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: 'Password reset successfully and Email sent' });
                }
            });
        });
    });
});

//change password
route.post('/change-password', (req, res) => {
    const { EmployeeId, oldPassword, newPassword } = req.body;
    
    const query = 'SELECT EmployeePassword FROM EmployeeDetails WHERE EmployeeId = ?';   
    db.query(query, [EmployeeId], (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Employee not found');
        } else {
            const dbPassword = results[0].EmployeePassword;
            if (dbPassword === oldPassword) {
                const updateQuery = 'UPDATE EmployeeDetails SET EmployeePassword = ? WHERE EmployeeId = ?';
                db.query(updateQuery, [newPassword, EmployeeId], (err, result) => {
                    if (err) {
                        console.error('Error updating password in MySQL:', err);
                        res.status(500).send('Error updating password');
                    } else {
                        res.send('Password updated successfully');
                    }
                });
            } else {
                res.status(401).send('Incorrect old password');
            }
        }
    });
});

//show employee by id
route.get('/showemployee/:empId', (req,res) => {
    const empId = req.params.empId;
    const query = "SELECT * FROM EmployeeDetails where EmployeeId = ?";
    db.query(query, empId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    })
});

//create trip request
route.post('/trips', (req, res) => {
    const { EmployeeId, date, inTime, outTime } = req.body;
    console.log(req.body)

    // const createTable = `
    //     CREATE TABLE IF NOT EXISTS CabBookingTable (
    //         Id VARCHAR(6) PRIMARY KEY,
    //         EmployeeId VARCHAR(255) NOT NULL,
    //         Date DATE NOT NULL,
    //         InTime TIME NULL,
    //         OutTime TIME NULL,
    //         CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //     )
    // `;
    
    // db.query(createTable, (err, result) => {
    //     if (err) throw err;
    //     console.log('Booking table created/exists!');
    // });

    if (!EmployeeId || !date) {
        return res.status(400).send('EmployeeId and date are required');
    }

    // const generateNextID = (lastID) => {
    //     if (!lastID) {
    //         return 'BK0001';
    //     }

    //     const prefix = 'BK';
    //     const num = parseInt(lastID.substring(2), 10);
    //     const nextNum = num + 1;
    //     return prefix + nextNum.toString().padStart(4, '0');
    // };

    const selectQuery = `SELECT * FROM CabBookingTable WHERE EmployeeId = ? AND TripDate = ?`;

    db.query(selectQuery, [EmployeeId, date], (err, results) => {
        if (err) {
            console.error('Error fetching trip data:', err);
            return res.status(500).send('Error fetching trip data');
        }

        if (results.length > 0) {
            const existingTrip = results[0];
            const updatedInTime = inTime ? inTime : existingTrip.LoginTime;
            const updatedOutTime = outTime ? outTime : existingTrip.LogoutTime;

            const updateQuery = `UPDATE CabBookingTable SET LoginTime = ?, LogoutTime = ? WHERE EmployeeId = ? AND TripDate = ?`;

            db.query(updateQuery, [updatedInTime, updatedOutTime, EmployeeId, date], (err, result) => {
                if (err) {
                    console.error('Error updating trip:', err);
                    return res.status(500).send('Error updating trip');
                }
                return res.status(200).send('Trip updated successfully');
            });

        } else {
            // If no row exists, generate a new ID and insert a new row
            // const getLastIDQuery = `SELECT Id FROM CabBookingTable ORDER BY Id DESC LIMIT 1`;

            // db.query(getLastIDQuery, (err, rows) => {
            //     if (err) {
            //         console.error('Error fetching last ID:', err);
            //         return res.status(500).send('Error fetching last ID');
            //     }

            //     const lastID = rows.length > 0 ? rows[0].Id : null;
            //     const newID = generateNextID(lastID);

                const insertQuery = `INSERT INTO CabBookingTable (EmployeeId, TripDate, LoginTime, LogoutTime) VALUES (?, ?, ?, ?)`;

                db.query(insertQuery, [EmployeeId, date, inTime, outTime], (err, result) => {
                    if (err) {
                        console.error('Error creating trip:', err);
                        return res.status(500).send('Error creating trip');
                    }
                    return res.status(200).send('Trip created successfully');
                });
            // });
        }
    });
});

route.post('/canceltrip/:tripId', (req, res) => {
  const tripId = req.params.tripId;

  // MySQL query to delete the record from CabBookingTable
  const query = 'DELETE FROM CabBookingTable WHERE BookingId = ?';``

  db.query(query, [tripId], (err, result) => {
    if (err) {
      console.error('Error deleting trip:', err);
      return res.status(500).send({message : 'Server error'});
    }

    // Check if the record was deleted
    if (result.affectedRows === 0) {
      return res.status(404).send({message : 'Trip not found'});
    }

    res.send({message : 'Trip canceled successfully'});
  });
});

//show trip request by id
route.get('/showtrips/:empId', (req,res) => {
    const empId = req.params.empId;
    const query = "SELECT * FROM CabBookingTable where EmployeeId = ?";
    db.query(query, empId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    })
});

//trip history APIs
route.get('/ridedetails/:empId', (req, res) => {
    const employeeId = req.params.empId;
    
    const query = `
      SELECT RideId, EmployeeId, EmployeeName, EmployeeAddress, EmployeeCity, 
             DriverName, VehicleNumber, LoginTime, LogoutTime, TripType, TripDate
      FROM TripHistory
      WHERE EmployeeId = ? 
      ORDER BY TripDate DESC`;
  
    db.query(query, [employeeId], (err, results) => {
      if (err) {
        console.error('Error fetching trip data:', err.message);
        return res.status(500).json({ error: 'Failed to fetch trip data' });
      }
      
      // Send the fetched trip data to the frontend
      res.json(results);
    });
  });

  route.get('/ridecount/:rideId', (req, res) => {
    const rideId = req.params.rideId;
  
    const countQuery = `
      SELECT RideId, COUNT(EmployeeId) AS employeeCount
      FROM TripHistory
      WHERE RideId = ?
      GROUP BY RideId`;
  
    db.query(countQuery, [rideId], (err, results) => {
      if (err) {
        console.error('Error fetching employee count:', err.message);
        return res.status(500).json({ error: 'Failed to fetch employee count' });
      }
      
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: 'No records found for the given RideId' });
      }
    });
  });

module.exports = route;