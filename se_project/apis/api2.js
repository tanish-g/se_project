// // const express = require('express');
// // const moment = require('moment');
// // const mysql = require('mysql');

// // const router = express.Router();

// // // Create a MySQL connection pool
// // const pool = mysql.createPool({
// //   host: 'localhost',
// //   user: 'root',
// //   password: 'password',
// //   database: 'mistest_db',
// //   waitForConnections: true,
// //   connectionLimit: 10,
// //   queueLimit: 0
// // });

// // // API endpoint to handle the query
// // router.get('/', async (req, res) => {
// //   const { admissionNumber } = req.query; // Get admission number from the query parameters
  
// //   try {
// //     const connection = await pool.getConnection();
    
// //     // SQL query to retrieve student details and course details based on admission number
// //     const [studentRows] = await connection.execute(`
// //       SELECT 
// //         student_name AS 'Name',
// //         email_id AS 'Email',
// //         session_year AS 'SessionYear',
// //         session AS 'SessionType',
// //         branch_id AS 'Branch'
// //       FROM 
// //         bank_fee_details
// //       WHERE 
// //         admn_no = ?
// //     `, [admissionNumber]);

// //     const [courseRows] = await connection.execute(`
// //       SELECT 
// //         subject_code AS 'course_code',
// //         subject_name AS 'course_name',
// //         sub_category AS 'course_type',
// //         'Alloted' AS 'status'
// //       FROM 
// //         cbcs_stu_course
// //       WHERE 
// //         admn_no = ?
// //     `, [admissionNumber]);

// //     connection.release();

// //     const result = {
// //       student_details: studentRows[0],
// //       courses: courseRows
// //     };

// //     res.json(result); // Send the combined query result as JSON response
// //   } catch (error) {
// //     console.error('Error executing SQL query:', error);
// //     res.status(500).json({ error: 'Internal Server Error' });
// //   }
// // });

// // module.exports = router;



// const express = require('express');
// const moment = require('moment');
// const mysql = require('mysql');

// const router = express.Router();

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'password',
//   database: 'mistest_db',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// const courseMapping = {
//   'b.tech': 'Bachelor of Technology',
//   'be': 'Bachelor of Engineering',
//   'comm': 'Common Course for 1st Year',
//   'dualdegree': 'Dual Degree',
//   'execmba': 'Executive Master of Business Administration',
//   'exemtech': 'Master of Technology (3 Years)',
//   'honour': 'Honours Course',
//   'int.m.sc': 'Integrated Master of Science',
//   'int.m.tech': 'Integrated Master of Technology',
//   'int.msc.tech': 'Integrated Master of Science and Technology',
//   'm.phil': 'Master of Philosophy',
//   'm.sc': 'Master of Science',
//   'm.sc.tech': 'Master of Science and Technology',
//   'm.tech': 'Master of Technology',
//   'mba': 'Master of Business Administration',
//   'minor': 'Minor Course',
//   'prep': 'Preparatory',
//   'jrf': 'Doctor of Philosophy',
//   'online': 'Online',
//   'mbaba': 'Master of Business Administration (BA)',
//   'dualdegree_categoryA': 'Dual Degree (Category A)',
//   'dualdegree_categoryB': 'Dual Degree (Category B)',
//   'dualdegree_categoryC': 'Dual Degree (Category C)',
//   'doublemajor': 'Double Major',
//   'PH.D': 'Doctor of Philosophy',
//   'MBA BA': 'Master of Business Administration',
//   'ma': 'Master of Arts',
//   'pgd': 'PG Diploma'
// };

// const branchMapping = {
//   'agl': 'Applied Geology',
//   'agp': 'Applied Geophysics',
//   'ba': 'Business Analytics',
//   'ce': 'Chemical Engineering',
//   'chem': 'Chemistry',
//   'civ': 'Civil Engineering',
//   'comm': 'Common Branch for 1st Year',
//   'csp': 'Communication and Signal Processing',
//   'cse': 'Computer Science and Engineering',
//   'cseis': 'Computer Science and Engineering with Spl. in Information Security',
//   'cse+cse': 'Computer Science and Engineering+Computer Science and Engineering',
//   'da': 'Data Analytics',
//   'dhss': 'Digital Humanities and Social Sciences',
//   'phd': 'Doctor of Philosophy',
//   'eqse': 'Earthquake Science & Engineering',
//   'ee': 'Electrical Engineering',
//   'ece': 'Electronics and Communication Engineering',
//   'ei': 'Electronics and Instrumentation Engineering',
//   'eg': 'Engineering Geology',
//   'ep': 'Engineering Physics',
//   'eng': 'English',
//   'env': 'Environmental Engineering',
//   'es': 'Environmental Science',
//   'ese': 'Environmental Science and Engineering',
//   'emba': 'Executive Master of Business Administration',
//   'fm': 'Financial Management',
//   'fe': 'Fuel Engineering',
//   'fmme': 'Fuel, Minerals and Metallurgical Engineering',
//   'gexp': 'Geo-Exploration',
//   'geo': 'Geomatics',
//   'gte': 'Geotechnical Engineering',
//   'hss': 'Humanities & Social Sciences',
//   'iem': 'Industrial Engineering and Management',
//   'jrf': 'Junior Research Fellow',
//   'mgmt': 'Management',
//   'mba': 'Master of Business Administration',
//   'math': 'Mathematics',
//   'm&c': 'Mathematics and Computing',
//   'mee': 'Mechanical Engg (Spl: Machine Design)',
//   'met': 'Mechanical Engg. (Spl: Maintenance Engineering and Tribology)',
//   'mech+mfg': 'Mechanical Engg. (Spl: Manufacturing Engineering)',
//   'mech+te': 'Mechanical Engg. (Spl: Thermal Engineering)',
//   'mech': 'Mechanical Engineering',
//   'mineee': 'Mine Electrical Engineering',
//   'mlmte': 'Mineral and Metallurgical Engineering',
//   'mle': 'Mineral Engineering',
//   'mle+mle': 'Mineral Engineering+Mineral Engineering',
//   'mexp': 'Mineral Exploration',
//   'min': 'Mining Engineering',
//   'me': 'Mining Engineering',
//   'me+me': 'Mining Engineering+Mining Engineering',
//   'mme': 'Mining Machinery Engineering',
//   'online': 'Online',
//   'ocm': 'Opencast Mining',
//   'om': 'Operation Management',
//   'ooce': 'Optoelectronics and Optical Communication Engineering',
//   'pe': 'Petroleum Engineering',
//   'pexp': 'Petroleum Exploration',
//   'phse': 'Pharmaceutical Science & Engineering',
//   'philo': 'Philosophy',
//   'phy': 'Physics',
//   'peed': 'Power Electronics and Electrical Drives',
//   'pse': 'Power System Engineering',
//   'prep': 'Preparatory',
//   'psycho': 'Psychology',
//   'rfme': 'RF & Microwave Engineering',
//   'smc': 'Social Media and Culture',
//   'soci': 'Sociology',
//   'stat': 'Statistics',
//   'se': 'Structural Engineering',
//   'tust': 'Tunnelling and Underground Space Technology',
//   'vlsid': 'VLSI Design'
// };

// const departmentMapping = {
//   'ac': 'Applied Chemistry',
//   'acad': 'Academic Section',
//   'acc': 'Accounts Section',
//   'admin': 'Administration Department',
//   'agl': 'Applied Geology',
//   'agp': 'Applied Geophysics',
//   'am': 'Applied Mathematics',
//   'ap': 'Applied Physics',
//   'auc': 'Audit  Section',
//   'auce': 'Automation Centre',
//   'ca': 'Campus Administration Section',
//   'cc': 'Computer Centre',
//   'ccb': 'Chemistry and Chemical Biology',
//   'ce': 'Chemical Engineering',
//   'chem': 'Chemistry',
//   'ciie': 'Centre for Innovation Incubation and Entrepreneurship',
//   'cmu': 'Campus Maintenance Section',
//   'comm': 'Common',
//   'crf': 'CRF Section',
//   'cse': 'Computer Science and Engineering',
//   'cve': 'Civil Engineering',
//   'droffice': 'Director Secretariate',
//   'dsw': 'DSW Office',
//   'ece': 'Electronics Engineering',
//   'edc': 'Executive Development Centre',
//   'ee': 'Electrical Engineering',
//   'ese': 'Environmental Science & Engineering',
//   'est': 'Establishment Section',
//   'exam': 'Examination Section',
//   'fme': 'Fuel, Minerals and Metallurgical Engineering',
//   'hc': 'Health Centre',
//   'hoad': 'Hostel Administration',
//   'hss': 'Humanities and Social Sciences',
//   'jeeoffice': 'JEE Office',
//   'lib': 'Library',
//   'mc': 'Mathematics and Computing',
//   'me': 'Mining Engineering',
//   'mech': 'Mechanical Engineering',
//   'mme': 'Mining Machinery Engineering',
//   'ms': 'Management Studies',
//   'msie': 'Management Studies and Industrial Engineering',
//   'nlhc': 'New Lecture Hall Complex',
//   'nvcti': 'Naresh Vashisht Centre for Tinkering and Innovation',
//   'odacad': 'Office of Dean (Acad)',
//   'odadmin': 'Office of Dean (Admin)',
//   'odfaculty': 'Office of Dean (Faculty)',
//   'odinfra': 'Office of Dean (Infra)',
//   'odiraa': 'Office of Dean (IRAA)',
//   'odrnd': 'Office of Dean (R&D)',
//   'ogj': 'Office of GATE-JAM',
//   'pc': 'Project Section',
//   'pcesection': 'PCE Section',
//   'pe': 'Petroleum Engineering',
//   'phy': 'Physics',
//   'prep': 'Preparatory',
//   'rgoff': 'RG Secretariate',
//   's&p': 'Store and Purchase Section',
//   'sracadh': 'Sr. Academic  Hostel',
//   'ss': 'Sports Section',
//   't&p': 'Training & Placement Section',
//   'tc': 'Transport & Vehicle Section',
//   'ws': 'Workshop Section'
// };

// // API endpoint to handle the query
// router.get('/', async (req, res) => {
//   const { admissionNumber } = req.query; // Get admission number from the query parameters

//   try {
//     // Get a connection from the pool
//     pool.getConnection((err, connection) => {
//       if (err) {
//         console.error('Error getting MySQL connection:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//         return;
//       }

//       // SQL query to retrieve student details and course details based on admission number
//       connection.query(
//         // `
//         // SELECT 
//         //   admn_no AS Adm_no,
//         //   student_name AS name,
//         //   branch_id AS department,
//         //   course_id AS programme,
//         //   branch_id AS branch,
//         //   amount AS fee_amount,
//         //   order_number AS transaction_id,
//         //   DATE_FORMAT(end_date, '%Y-%m-%d') AS fee_data,
//         //   payment_receipt AS download
//         // FROM 
//         //   bank_fee_details
//         // WHERE 
//         //   admn_no = ?
//         // `,
//         `
//         SELECT 
//             bd.admn_no AS Adm_no,
//             bd.student_name AS name,
//             cd.name AS department
//             cc.name AS programme,
//             bb.name AS branch,
//             bd.amount AS fee_amount,
//             bd.order_number AS transaction_id,
//             DATE_FORMAT(bd.end_date, '%Y-%m-%d') AS fee_data,
//             bd.payment_receipt AS download,
//         FROM 
//             bank_fee_details bd
//         JOIN 
//             cbcs_courses cc ON bd.course_id = cc.id
//         JOIN
//             cbcs_branches bb ON bd.branch_id = bb.id
//         JOIN
//             cbcs_departments cd ON bd.branch_id = cd.id
//         WHERE 
//             bd.admn_no = ? 
//             AND cc.status = 1
//             AND cd.status = 1
//             AND cd.type = 'academic';
//         `,
//         [admissionNumber],
//         (error, studentRows) => {
//           if (error) {
//             console.error('Error executing student details query:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//             connection.release(); // Release the connection back to the pool
//             return;
//           }

//           // Handle course details query similarly
//           connection.query(
//             `
//             SELECT 
//               subject_code AS 'course_code',
//               subject_name AS 'course_name',
//               sub_category AS 'course_type',
//               'Alloted' AS 'status'
//             FROM 
//               pre_stu_course
//             WHERE 
//               admn_no = ?
//             AND
//               remark2 = 3
//             `,
//             [admissionNumber],
//             (err, courseRows) => {
//               if (err) {
//                 console.error('Error executing course details query:', err);
//                 res.status(500).json({ error: 'Internal Server Error' });
//                 connection.release(); // Release the connection back to the pool
//                 return;
//               }

//               connection.release(); // Release the connection back to the pool
//               // studentRows.forEach((row) => {
//               //   row.programme = courseMapping[row.programme] || 'Unknown'; // Default to 'Unknown' if mapping not found
//               //   row.branch = branchMapping[row.branch] || 'Unknown';
//               //   row.department = departmentMapping[row.department] || 'Unknown';
//               // });
//               const result = {
//                 student_details: studentRows[0],
//                 courses: courseRows
//               };

//               res.json(result); // Send the combined query result as JSON response
//             }
//           );
//         }
//       );
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;


const express = require('express');
const moment = require('moment');
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

// API endpoint to handle the query
router.get('/', async (req, res) => {
  const { admissionNumber , sessionYear,session} = req.query; // Get admission number from the query parameters

  try {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // SQL query to retrieve student details and course details based on admission number
      connection.query(
        `
        SELECT 
            bd.admn_no AS Adm_no,
            bd.student_name AS name,
            cd.name AS department,
            cc.name AS programme,
            bb.name AS branch,
            bd.amount AS fee_amount,
            bd.order_number AS transaction_id,
            DATE_FORMAT(bd.end_date, '%Y-%m-%d') AS fee_data,
            bd.payment_receipt AS download
        FROM 
            bank_fee_details bd
        JOIN 
            cbcs_courses cc ON bd.course_id = cc.id
        JOIN
            cbcs_branches bb ON bd.branch_id = bb.id
        JOIN
            cbcs_departments cd ON bd.branch_id = cd.id
        WHERE 
            bd.admn_no = ?
            AND bd.session = ?
            AND bd.session_year = ?
            AND cc.status = 1
            AND cd.status = 1
            AND cd.type = 'academic'
        `,
        [admissionNumber,session,sessionYear],
        (error, studentRows) => {
          if (error) {
            console.error('Error executing student details query:', error);
            res.status(500).json({ error: 'Internal Server Error' });
            connection.release(); // Release the connection back to the pool
            return;
          }

          // Handle course details query similarly
          connection.query(
            `
            SELECT 
              subject_code AS 'course_code',
              subject_name AS 'course_name',
              sub_category AS 'course_type',
              'Alloted' AS 'status'
            FROM 
              pre_stu_course
            WHERE 
              admn_no = ?
              AND session = ?
              AND session_year = ?
            AND
              remark2 = 3
            `,
            [admissionNumber,session,sessionYear],
            (err, courseRows) => {
              if (err) {
                console.error('Error executing course details query:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                connection.release(); // Release the connection back to the pool
                return;
              }

              connection.release(); // Release the connection back to the pool
              const result = {
                student_details: studentRows[0],
                courses: courseRows
              };

              res.json(result); // Send the combined query result as JSON response
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

