const express = require('express');
const mysql = require('mysql');

const router = express.Router();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'mistest_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// API endpoint to fetch branch IDs and names where status=1
router.get('/', async (req, res) => {
  try {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // SQL query to retrieve branch IDs and names where status=1
      connection.query(
        `
        SELECT 
            id AS branch_id,
            name AS branch_name
        FROM 
            cbcs_branches
        WHERE 
            status = 1
        `,
        (error, branchResults) => {
          if (error) {
            console.error('Error executing branch query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            connection.release(); // Release the connection back to the pool
            return;
          }

          // SQL query to retrieve department IDs and names where status=1
          connection.query(
            `
            SELECT 
                id AS department_id,
                name AS department_name
            FROM 
                cbcs_departments
            WHERE 
                status = 1
                AND type = 'academic'
            `,
            (deptError, departmentResults) => {
              if (deptError) {
                console.error('Error executing department query:', deptError);
                res.status(500).json({ error: 'Internal Server Error' });
                connection.release(); // Release the connection back to the pool
                return;
              }

              // SQL query to retrieve course IDs and names where status=1
              connection.query(
                `
                SELECT 
                    id AS course_id,
                    name AS course_name
                FROM 
                    cbcs_courses
                WHERE 
                    status = 1
                `,
                (courseError, courseResults) => {
                  connection.release(); // Release the connection back to the pool

                  if (courseError) {
                    console.error('Error executing course query:', courseError);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                  }

                  const result = {
                    branches: branchResults,
                    departments: departmentResults,
                    courses: courseResults
                  };

                  res.json(result); // Send the combined query results as JSON response
                }
              );
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
