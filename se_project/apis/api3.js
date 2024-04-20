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
    const { admn_no } = req.body;
    if (!admn_no) {
      return res.status(400).json({ error: 'Admission number is required' });
    }
  
    const copyQuery = `
      INSERT INTO cbcs_stu_course 
      (id, form_id, admn_no, sub_offered_id, subject_code, course_aggr_id, subject_name, priority, sub_category, map_id, sub_category_cbcs_offered, course, branch, session_year, session, updated_at)
      SELECT 
        psc.id,
        psc.form_id,
        psc.admn_no,
        CAST(SUBSTRING(psc.sub_offered_id, 2) AS UNSIGNED) AS sub_offered_id,
        psc.subject_code,
        psc.course_aggr_id,
        psc.subject_name,
        psc.priority,
        psc.sub_category,
        psc.map_id,
        psc.sub_category_cbcs_offered,
        psc.course,
        psc.branch,
        psc.session_year,
        psc.session,
        psc.updated_at
      FROM pre_stu_course AS psc
      WHERE psc.admn_no = ? AND psc.remark2 = 3;
    `;
  
    pool.query(copyQuery, [admn_no], (error, results) => {
      if (error) {
        console.error('Error getting MySQL connection:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Records copied successfully' });
    });
});

module.exports = router;
