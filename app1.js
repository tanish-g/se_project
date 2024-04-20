const express = require('express');
const mysql = require('mysql');
const moment = require('moment');

const app = express();
const port = 3000; // or any other port you prefer

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database_name'
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to handle frontend requests and pass the SQL query
app.post('/query', (req, res) => {
  // Get input data from the frontend
  const { session, sessionYear, admnNo } = req.body;

  // Original date
  const originalDate = '2023-12-09T18:30:00.000Z';

  // Convert the date using moment.js
  const correctedDate = moment(originalDate).format('YYYY-MM-DD');

  // Check if any input is provided
  if (!session && !sessionYear && !admnNo) {
    res.status(400).json({ error: 'No input provided' });
  } else {
    // Variables to store conditions based on input values
    let conditions = '';

    if (session) {
      conditions += `(session IS NULL OR session = '${session}')`;
    }

    if (sessionYear) {
      if (conditions !== '') {
        conditions += ' AND ';
      }
      conditions += `(session_year IS NULL OR session_year = '${sessionYear}')`;
    }

    if (admnNo) {
      if (conditions !== '') {
        conditions += ' AND ';
      }
      conditions += `(admn_no IS NULL OR admn_no = '${admnNo}')`;
    }

    // SQL query to select and rename columns with dynamic conditions
    const sqlQuery = `
      SELECT 
        admn_no AS 'Admission Number', 
        student_name AS 'Name', 
        branch_id AS 'Department', 
        course_id AS 'Course', 
        branch_id AS 'Branch', 
        amount AS 'Fee Amount', 
        order_number AS 'Transaction ID', 
        payment_msg AS 'Fee Status', 
        payment_receipt AS 'Fee Receipt', 
        '${correctedDate}' AS 'Date',  -- Corrected date here
        semester AS 'Semester' 
      FROM 
        bank_fee_details
      WHERE 
        ${conditions}
    `;

    // Execute the query using the connection pool
    pool.query(sqlQuery, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
