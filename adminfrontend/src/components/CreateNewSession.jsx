import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { HOST } from "./constants";

const CreateNewSession = ({ viewCreateNewSession, setViewCreateNewSession }) => {
  const divRef = useRef(null);
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [examType, setExamType] = useState("");

  const handleCreateSession = async () => {
    try {
        // Construct the new session string
        const newSession = `${year}_${term}_${examType}`;
        // Make a POST request to add the new session
        const response = await axios.post(`${HOST}/addSession`, {
            newSession: newSession
        });

        // Log the updated sessions for debugging
        console.log("Updated Sessions:", response.data.sessions);

        // Notify the user
        alert("Session Created");

        // Reset fields and close the modal
        setYear("");
        setTerm("");
        setExamType("");
        setViewCreateNewSession(false);
    } catch (error) {
        console.error("Error creating session:", error);
        alert("Failed to create session. Please try again.");
    }
};


  // Function to handle outside clicks
  const handleOutsideClick = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setViewCreateNewSession(false);
    }
  };

  // Attach and remove event listener for clicks
  useEffect(() => {
    if (viewCreateNewSession) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [viewCreateNewSession]);

  // Check if "Create Session" button should be enabled
  const isCreateSessionEnabled =
    year.length === 4 && term !== "" && examType !== "";

  if (!viewCreateNewSession) return null;

  return (
    <div
      ref={divRef}
      style={{
        position: "absolute",
        top: "150px",
        left: "350px",
        height: "50vh",
        width: "50vw",
        padding: "20px",
        backgroundColor: "#ffffff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Create New Session</h2>
      <input
        type="number"
        placeholder="Year (e.g., 2025)"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          width: "100%",
          marginBottom: "15px",
        }}
      />
      <select
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          width: "100%",
          marginBottom: "15px",
        }}
      >
        <option value="">Select Term</option>
        <option value="summer">Summer Term</option>
        <option value="winter">Winter Term</option>
      </select>
      <select
        value={examType}
        onChange={(e) => setExamType(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          width: "100%",
          marginBottom: "20px",
        }}
      >
        <option>Select Exam Type</option>
        <option>mtt</option>
        <option>ett</option>
        <option>reappear</option>
      </select>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setViewCreateNewSession(false)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateSession}
          disabled={!isCreateSessionEnabled}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: isCreateSessionEnabled ? "#4CAF50" : "#cccccc",
            color: isCreateSessionEnabled ? "white" : "#666666",
            border: "none",
            borderRadius: "6px",
            cursor: isCreateSessionEnabled ? "pointer" : "not-allowed",
          }}
        >
          Create Session
        </button>
      </div>
    </div>
  );
};

export default CreateNewSession;
