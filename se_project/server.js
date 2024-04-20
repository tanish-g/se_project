// server.js
const express = require('express');
const bodyParser = require('body-parser');
const queryApi = require('./apis/api1');
const postApi = require('./apis/api2');
const cbcsApi = require('./apis/api3');
const finregApi = require('./apis/api4');
const ddApi = require('./apis/api5');
const app = express();
const port = 8000; // Or any other port you prefer

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Mount the query API endpoint
app.use('/api/show_student_details', queryApi);
app.use('/api/show_pre_stu', postApi);
app.use('/api/cbcs', cbcsApi);
app.use('/api/final_reg', finregApi);
app.use('/api/drop_down', ddApi);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
