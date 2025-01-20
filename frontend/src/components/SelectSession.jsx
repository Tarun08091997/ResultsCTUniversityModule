import React, { useState } from "react";
import axios from 'axios'
import { useEffect } from "react";
const SelectSession = ({ setDisableSearch, setSession }) => {
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [examType, setExamType] = useState("");

  const [yearList , setYearList] = useState(["2022" , "2023" , "2024"]);
  const [termList , setTermList] = useState(["summer" , "winter"]);
  const [examTypeList , setExamTypeList] = useState(["ett" , "mtt", "reappear"]);

  const fetchSession = async () => {
    try {
      const response = await axios.get("/api/getSessions");
      // const response = await axios.get("http://localhost:4000/getSessions");
      const sessions = response.data.sessions;
      // Extract unique years, terms, and exam types
      const years = new Set();
      const terms = new Set();
      const examTypes = new Set();
  
      sessions.forEach((session) => {
        const [year, term, examType] = session.split('_');
        years.add(year);
        terms.add(term.toUpperCase()); // Normalize case for consistency
        examTypes.add(examType.toUpperCase()); // Normalize case for consistency
      });
  
      // Update state with unique sorted values
      setYearList(Array.from(years).sort());
      setTermList(Array.from(terms).sort());
      setExamTypeList(Array.from(examTypes).sort());
  
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useEffect(()=>{
    fetchSession();
  },[]);

  useEffect(()=>{
    
    const selectedSession = `${year}_${term.toLowerCase()}_${examType.toLowerCase()}`;
    if(year != "" && term != "" && examType != ""){
      setDisableSearch(false);
    }
    setSession(selectedSession);

  },[year , term , examType])

  const STYLE = {
    padding: "5px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    textAlign:'center'
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        display: "flex",
        gap: "15px",
        width: "800px",
        marginBottom:'30px'
      }}
    >
      <select
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
        }}
        style={STYLE}
      >
        <option value="">Select Year</option>
        {yearList.map((val , index) => (
          <option key = {index}>{val}</option>
        ))}
      </select>
      <select
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
        }}
        style={STYLE}
      >
        <option value="">Select Exam Month</option>
        {termList.map((val,index)=>(
          <option key={index}>{val}</option>
        ))}
      </select>
      <select
        value={examType}
        onChange={(e) => {
          setExamType(e.target.value);
        }}
        style={STYLE}
      >
        <option value="">Select Exam Type</option>
        {examTypeList.map((val,index) =>(
          <option key={index}>{val}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectSession;
