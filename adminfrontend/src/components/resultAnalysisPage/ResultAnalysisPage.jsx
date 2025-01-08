import React, { useState } from 'react';
import axios from 'axios';
import './ResultAnalysisPage.css';
import { HOST } from '../constants';
const ResultAnalysisPage = ({ setData, data , error, setFrontPage }) => {
  const [schoolName, setSchoolName] = useState(data[0].COLLEGE);
  const [course, setCourse] = useState(data[0].COURSE);
  const [totalSubjects, setTotalSubjects] = useState(data[0].subjectCodes.length);
  const [totalStudents, setTotalStudents] = useState(data.length);
  const [semester, setSemester] = useState(data[0].semester);
  const [examMonth, setExamMonth] = useState(data[0]['EXAMINATION M/YR']);

  const sendData = async () => {
    // Check if the input data has changed compared to the first student's data
    const isDataChanged = 
      schoolName !== data[0].COLLEGE ||
      course !== data[0].COURSE ||
      semester !== data[0].semester ||
      examMonth !== data[0]['EXAMINATION M/YR'];

    // If data has changed, update it
    const updatedData = isDataChanged
      ? data.map(student => ({
          ...student,
          COLLEGE: schoolName,
          COURSE: course,
          semester: semester,
          'EXAMINATION M/YR': examMonth,
        }))
      : data;

    // Send the data to the server
    try {
      const response = await axios.post(`${HOST}/addResult`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Data successfully sent to the server');
      } 
      else {
        alert('Failed to send data to the server');
      }
    } catch (error) {
      console.error('Error sending data to the server:', error);
      alert('Error sending data to the server');
    }

    setFrontPage(true);
  };

  return (
    <div className="result-analysis-page">
      {/* Top section with input fields */}
      <div className="input-section">
        <div className="input-group">
          <label>School Name</label>
          <textarea type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Course</label>
          <textarea type="text" value={course} onChange={(e) => setCourse(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Total Subjects</label>
          <input type="number" disabled={true} value={totalSubjects} onChange={(e) => setTotalSubjects(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Total Students</label>
          <input type="number" value={totalStudents} disabled={true} onChange={(e) => setTotalStudents(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Semester</label>
          <input type="text" value={semester} onChange={(e) => setSemester(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Exam Month</label>
          <input type="text" value={examMonth} onChange={(e) => setExamMonth(e.target.value)} />
        </div>
      </div>

      <label style={{font:'20px' , fontWeight:'bold' , color : 'red', margin:'10px'}}>Total Error : {error.total}</label>

      {/* Data table section */}
      <div className="table-section">
        <table>
          <thead>
            <tr>
              <th>ENROLEMENT NO</th>
              <th>studentName</th>
              <th>status</th>
              <th>percentage</th>
              <th>sgpa</th>
              <th>Subject Details</th>
            </tr>
          </thead>
          <tbody>
            {data.map((student, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{student['ENROLEMENT NO']}</td>
                  <td>{student.studentName}</td>
                  <td>{student.status}</td>
                  <td>{student.percentage}</td>
                  <td>{student.sgpa}</td>
                  <td colSpan="5">
                    <table className="sub-table">
                      <thead>
                        <tr>
                          <th>Subject Code</th>
                          <th>Subject Name</th>
                          <th>Credit</th>
                          <th>Grade</th>
                          <th>Grade Point</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.subjectCodes.map((code, idx) => (
                          <tr key={idx}>
                            <td>{code}</td>
                            <td>{student.subjects[idx]}</td>
                            <td>{student.credits[idx]}</td>
                            <td>{student.grades[idx]}</td>
                            <td>{student.gps[idx]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons section */}
      <div className="button-section">
        <button onClick={() => { setFrontPage(true); setData([]); }}>Back</button>
        {error.total == 0 && <button onClick={sendData}>Create</button>}
      </div>
    </div>
  );
};

export default ResultAnalysisPage;
