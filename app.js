const express = require('express');
const mysql = require('mysql');
const moment = require('moment');

const app = express();
const port = 3000; // or any other port you prefer

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mistest_db'
});

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JavaScript)
app.use(express.static('public'));

// Route to handle frontend requests and pass the SQL query
app.post('/query', (req, res) => {
  // Get input data from the frontend
  const { sessionInput, sessionYearInput, admnNoInput } = req.body;

  // Original date
  const originalDate = '2023-12-09T18:30:00.000Z';

  // Convert the date using moment.js
  const correctedDate = moment(originalDate).format('YYYY-MM-DD');

  // Check if any input is provided
  if (!sessionInput && !sessionYearInput && !admnNoInput) {
    res.status(400).json({ error: 'No input provided' });
  } else {
    // Variables to store conditions based on input values
    let conditions = '';

    if (sessionInput) {
      conditions += `(session IS NULL OR session = '${sessionInput}')`;
    }

    if (sessionYearInput) {
      if (conditions !== '') {
        conditions += ' AND ';
      }
      conditions += `(session_year IS NULL OR session_year = '${sessionYearInput}')`;
    }

    if (admnNoInput) {
      if (conditions !== '') {
        conditions += ' AND ';
      }
      conditions += `(admn_no IS NULL OR admn_no = '${admnNoInput}')`;
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


