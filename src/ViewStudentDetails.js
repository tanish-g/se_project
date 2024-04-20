import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewStudentDetails.css'; // Import CSS file for styling

const ViewStudentDetails = () => {
  // Dummy student data
  const { id, session, sessionYear   } = useParams(); // Get the admission number from URL parameter
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [feeDetails, setFeeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await fetch(`/api/show_pre_stu?admissionNumber=${id}&sessionYear=${sessionYear}&session=${session}`);

        if (!response.ok) {
          alert('Failed to fetch student details');
        }

        const data = await response.json();
        setStudentDetails(data.student_details);
        setCourses(data.courses);
        setFeeDetails({
            feeAmount: data.student_details.fee_amount,
            transactionId: data.student_details.transaction_id,
            feeData: data.student_details.fee_data,
          });
          setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [id]);

  const handleVerify = async () => {
    try {
      const response = await fetch('/api/cbcs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admn_no: id }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify');
      }

      alert('Verified successfully');
      navigate('/', { replace: true })
    } catch (error) {
      alert('Verification failed');
    }
  };

  if (loading) {
    return <p></p>; // Render loading indicator
  }

  if (error) {
    return <p>Error: {error}</p>; // Render error message
  }

  return (
    <div className="container">
      <h1>View Student Details</h1>
      <div className="student-details">
        <div className="text-details">
          <p><strong>Admission Number:</strong> {studentDetails.Adm_no}</p>
          <p><strong>Name:</strong> {studentDetails.name}</p>
          <p><strong>Department:</strong> {studentDetails.department}</p>
          <p><strong>Programme:</strong> {studentDetails.programme}</p>
          <p><strong>Branch:</strong> {studentDetails.branch}</p>
        </div>
        <div className="photo">
          <img src={studentDetails.photo} alt="Student" />
        </div>
      </div>
      {/* Display courses */}
      <div className="table-container">
        <h2>Course Details</h2>
        <table className="details-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Course Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>{course.course_code}</td>
              <td>{course.course_name}</td>
              <td>{course.course_type}</td>
              <td>{course.status}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      {/* Display fee payment details */}
      <div className="table-container">
        <h2>Pre-registration Fee Details</h2>
        <table className="details-table">
          <thead>
            <tr>
              <th>Fee Amount</th>
              <th>Transaction ID</th>
              <th>Submission Date</th>
            </tr>
          </thead>
          <tbody>
              <tr key={0}>
                <td>{feeDetails.feeAmount}</td>
                <td>{feeDetails.transactionId}</td>
                <td>{feeDetails.feeData}</td>
              </tr>
          </tbody>
        </table>
      </div>
      <button onClick={handleVerify}>Verify Student Details</button>
    </div>
  );
};

export default ViewStudentDetails;
