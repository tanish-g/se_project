import React, { useState, useEffect } from 'react';
import './SearchFinalRegisteredStudents.css'; // Import CSS file for styling

const SearchFinalRegisteredStudents = () => {
  const [session, setSession] = useState('');
  const [sessionYear, setSessionYear] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [matchingStudents, setMatchingStudents] = useState([]);

  useEffect(() => {
    // Fetch data for dropdowns
    fetchDropdownData();
  }, []);

  const fetchDropdownData = () => {
    // Fetch dropdown data from API
    fetch('/api/drop_down')
      .then(response => response.json())
      .then(data => {
        setBranches(data.branches);
        setCourses(data.courses);
        setDepartments(data.departments);
      })
      .catch(error => console.error('Error fetching dropdown data:', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  // Prepare data for API call
  const requestData = {
    "admn_no": admissionNumber,
    "session": session,
    "sessionYear": sessionYear,
    "course": selectedCourse,
    "branch": selectedBranch
  };

  // Call the API
  fetch('/api/final_reg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.results && data.results.length > 0) {
      // Set matching students
      setMatchingStudents(data.results);
    } else {
      // No matching students found
      setMatchingStudents([]);
    }
  })
  .catch(error => {
    console.error('Error fetching matching students:', error);
    alert('Error while fetching students!')
    // Clear matching students on error
    setMatchingStudents([]);
  });
//     setMatchingStudents(fetchedMatchingStudents);
  };

  return (
    <div className="container">
      <h1>Search Final Registered Students</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label className="form-label">
            Session:
            <select value={session} onChange={(e) => setSession(e.target.value)} className="form-input">
              <option value="">Select Session</option>
              <option value="Monsoon">Monsoon</option>
              <option value="Winter">Winter</option>
              <option value="Summer">Summer</option>
              {/* Add more session options if needed */}
            </select>
          </label>
          <label className="form-label">
            Session Year:
            <select value={sessionYear} onChange={(e) => setSessionYear(e.target.value)} className="form-input" >
              <option value="">Select Year</option>
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
            </select>
          </label>
          <label className="form-label">
            Admission Number:
            <input type="text" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} className="form-input" />
          </label>
        </div>
        <div className="form-row">
          <label className="form-label">
            Branch:
            <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="form-input">
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.branch_id} value={branch.branch_id}>{branch.branch_name}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Course:
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="form-input">
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.course_id} value={course.course_id}>{course.course_name}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Department:
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="form-input">
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.department_id} value={department.department_id}>{department.department_name}</option>
              ))}
            </select>
          </label>
        </div>
        {/* Submit button in a new row */}
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="submit-btn">Search</button>
        </div>
      </form>
      <div className="table-container">
        <h2>Matching Students</h2>
        <table className="students-table">
          <thead>
            <tr>
              <th>Admission Number</th>
              <th>Session</th>
              <th>Semester</th>
              <th>Course</th>
              <th>Branch</th>
              <th>Registration Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {matchingStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.admn_no}</td>
                <td>{student.session}</td>
                <td>I will be fetched</td>
                <td>{student.course}</td>
                <td>{student.branch}</td>
                <td>{student.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SearchFinalRegisteredStudents;
