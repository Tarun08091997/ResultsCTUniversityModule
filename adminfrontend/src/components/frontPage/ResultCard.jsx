import React, { useState } from 'react';
import './ResultCard.css'; // Import your CSS file for styling
import axios from 'axios'
import { HOST } from '../constants';

const ResultCard = ({ res }) => {
  const [dob, setDob] = useState(()=>{
    if(res.DOBDATA.success){
      return res.DOBDATA.DOB;
    }
    return '00-00-0000';
  });

  const handleDate = (date) =>{
    const [y,m,d] = date.split('-');
    const val = d+"-"+m+"-"+y;
    setDob(val);
  }
  const handleChange = async(reg) =>{
    
    const resp = await axios.post(`${HOST}/examination/updateDateOfBirth`,
      {
        REG:reg , 
        DOB:dob
      }
    );
    alert(resp.data);
  }


  if (res.DOBDATA.success && !res.RESULTDATA.success) {
    return <div className="result-card">No Result Available but DOB = {dob}.</div>;
  }

  if (!res.DOBDATA.success && !res.RESULTDATA.success) {
    return <div className="result-card">No DATA Available</div>;
  }

  const certificateData = res.RESULTDATA;

  return (
    <div className="result-card">
      <div className="result-info">
        <div className="result-info-row">
          <label>Date of Birth:</label>
          <label>{res.DOBDATA.DOB}</label>
          <input
            type="date"
            onChange={(e) => handleDate(e.target.value)}
            className="dob-input"
          />
          <button onClick={() => handleChange(certificateData.ENROLLMENT_NO)}>Change</button>
        </div>
        <div className="result-info-columns">
          <div className="result-info-column">
            <div className="result-info-row">
              <label>Name:</label>
              <span>{certificateData.STUDENT_NAME}</span>
            </div>
            <div className="result-info-row">
              <label>Enrollment No:</label>
              <span>{certificateData.ENROLLMENT_NO}</span>
            </div>
            <div className="result-info-row">
              <label>College:</label>
              <span>{certificateData.COLLEGE}</span>
            </div>
            <div className="result-info-row">
              <label>Exam Month & Year:</label>
              <span>{certificateData.EXAM_MONTH_YEAR}</span>
            </div>
          </div>
          <div className="result-info-column">
            <div className="result-info-row">
              <label>Course:</label>
              <span>{certificateData.COURSE}</span>
            </div>
            <div className="result-info-row">
              <label>Semester:</label>
              <span>{certificateData.SEMESTER}</span>
            </div>
            <div className="result-info-row">
              <label>Percentage:</label>
              <span>{certificateData.PERCENTAGE}</span>
            </div>
            <div className="result-info-row">
              <label>Status:</label>
              <span>{certificateData.STATUS}</span>
            </div>
          </div>
        </div>
      </div>

      <table className="result-table">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>Subject Code</th>
            <th>Subject</th>
            <th>Credit</th>
            <th>Grade</th>
            <th>Grade Point</th>
          </tr>
        </thead>
        <tbody>
          {certificateData.SUBJECT_CODES.map((subjectCode, index) => (
            <tr key={subjectCode}>
              <td>{index + 1}</td>
              <td>{subjectCode}</td>
              <td>{certificateData.SUBJECTS[index]}</td>
              <td>{certificateData.CREDITS[index]}</td>
              <td>{certificateData.GRADES[index]}</td>
              <td>{certificateData.GPS[index]}</td>
            </tr>
          ))}
          <tr className="sgpa-row">
            <td colSpan="5" className="sgpa-label">SGPA</td>
            <td>{certificateData.SGPA}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResultCard;
