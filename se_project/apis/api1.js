// apis/queryApi.js
const express = require('express');
const moment = require('moment');
const mysql = require('mysql');

const router = express.Router();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mistest_db'
});

// API endpoint to handle the query
router.post('/', (req, res) => {
  const { session, sessionYear, admnNo } = req.body;

  // Check if any input is provided
  if (!session && !sessionYear && !admnNo) {
    return res.status(400).json({ error: 'No entries provided' });
  }

  // Convert the date using moment.js
//   const originalDate = '2023-12-09T18:30:00.000Z';
//   const correctedDate = moment(originalDate).format('YYYY-MM-DD');

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return formattedDate;
  };

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
      DATE_FORMAT(end_date, '%Y-%m-%d') AS 'Date',  -- Corrected date here
      semester AS 'Semester' 
    FROM 
      bank_fee_details
    WHERE 
      ${conditions}
  `;

  // Execute the query using the connection pool
  pool.query(sqlQuery, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    results.forEach((row) => {
        row.end_date = formatDate(row.end_date);
      });
    res.json({ results });
  });
});

module.exports = router;
