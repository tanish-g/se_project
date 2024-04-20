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
  const { session, sessionYear, admnNo, course, branch} = req.body;

  // Check if any input is provided
  if (!session && !sessionYear && !admnNo) {
    return res.status(400).json({ error: 'No entries provided' });
  }

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

  if (course) {
    if (conditions !== '') {
      conditions += ' AND ';
    }
    conditions += `(course IS NULL OR course = '${course}')`;
  }

  if (branch) {
    if (conditions !== '') {
      conditions += ' AND ';
    }
    conditions += `(branch IS NULL OR branch = '${branch}')`;
  }
  
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleString('en-US', { timeZone: 'UTC', hour12: false });
//   };

   const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;
        return formattedDate;
    };

  const filterAndGroupQuery = `
    SELECT admn_no, session, course, branch, updated_at , COUNT(*) AS record_count
    FROM cbcs_stu_course
    WHERE 
    ${conditions}
    GROUP BY admn_no, session, course, branch, updated_at;
  `;

  pool.query(filterAndGroupQuery, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    results.forEach((row) => {
        row.updated_at = formatDate(row.updated_at);
      });
    res.json({ results });
  });
});

module.exports = router;
