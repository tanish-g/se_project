import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SearchPreRegisteredStudents = () => {
  const [session, setSession] = useState('');
  const [sessionYear, setSessionYear] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/show_student_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionYear,
          session,
          admnNo: admissionNumber,
        }),
      });

      if (!response.ok) {
        alert('Failed to fetch data');
      }

      const data = await response.json();
      setMatchingStudents(data.results);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Search Pre-registered students</h1>
      <form onSubmit={handleSubmit} className="form">
        <label className="form-label">
          Session:
          <select value={session} onChange={(e) => setSession(e.target.value)} className="form-input">
            <option value="">Select Session</option>
            <option value="Monsoon">Monsoon</option>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>
        </label>
        <label className="form-label">
          Session Year:
          <select value={sessionYear} onChange={(e) => setSessionYear(e.target.value)} className="form-input" >
            <option value="">Select Year</option>
            <option value="2022-2023">2022-23</option>
            <option value="2023-2024">2023-24</option>
            <option value="2024-2025">2024-25</option>
          </select>
        </label>
        <label className="form-label">
          Admission Number:
          <input type="text" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} className="form-input" />
        </label>
        <button type="submit" className="submit-btn">Search</button>
      </form>
      <div className="table-container">
        <h2>Matching Students</h2>
        <table className="students-table">
          <thead>
            <tr>
            <th>Admission Number</th>
              <th>Name</th>
              <th>Department</th>
              <th>Course</th>
              <th>Branch</th>
              <th>Fee Amount</th>
              <th>Transaction ID</th>
              <th>Fee Status</th>
              <th>Date</th>
              <th>Semester</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {matchingStudents.map((student, index) => (
              <tr key={index}>
                <td>{student['Admission Number']}</td>
                <td>{student['Name']}</td>
                <td>{student['Department']}</td>
                <td>{student['Course']}</td>
                <td>{student['Branch']}</td>
                <td>{student['Fee Amount']}</td>
                <td>{student['Transaction ID']}</td>
                <td>{student['Fee Status']}</td>
                <td>{student['Date']}</td>
                <td>{student['Semester']}</td>
                {/* <td>
                  <button onClick={() => console.log("View details for student:", student.admissionNumber)}>View Details</button>
                </td> */}
                <td>
                  {/* Link to student's details page */}
                  <Link to={`/view/${student['Admission Number']}/${sessionYear}/${session}`} className="view-details-link"><button>View Details</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchPreRegisteredStudents;
