const mysql = require('mysql2');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',       // Your MySQL server host
  user: 'root',            // Your MySQL user (adjust as needed)
  password: 'Reddy',    // Your MySQL password
  database: 'admin_portal'  // The name of your database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection;
