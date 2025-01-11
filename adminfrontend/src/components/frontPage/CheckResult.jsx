import React, { useState } from 'react';
import axios from 'axios'
import { HOST } from '../constants';
import ResultCard from './ResultCard';

export default function CheckResult({selectedSession}) {

    const [reg,setReg] = useState('');
    const [res , setRes] = useState({
        DOBDATA : {success:false},
        RESULTDATA:{success:false}
      });

      const handleSearch = async () => {
        // Check if registration number and session are valid
        if (reg.length !== 8 || !selectedSession) {
            alert("Please provide a valid Registration Number and select a session.");
            return;
        }
    
        try {
            // Make the API call
            const response = await axios.post(`${HOST}/examination/${reg}`, { session: selectedSession });
            if(response.data.RESULTDATA.success == false){
                alert(`${reg} does not exist in selected Session`);
            }
            // Check if response data exists
            else if (response && response.data) {
                setRes(response.data); // Update the state with the response data
                console.log("Response Data:", response.data);
            } else {
                console.warn("No data received in response.");
                alert("No data found for the provided Registration Number and session.");
            }
        } catch (error) {
            // Handle specific error responses
            if (error.response) {
                console.error("Server responded with an error:", error.response.data);
                alert(`Error: ${error.response.data.message || "An error occurred on the server."}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("No response from the server. Please check your network connection.");
            } else {
                console.error("Error setting up the request:", error.message);
                alert(`An unexpected error occurred: ${error.message}`);
            }
        }
    };
    

  return (
    <div style={{position:'absolute', top:'175px'}}>
        {/* Search Bar */}
         <div style={{
                width:'25vw',
                border:'2px solid black',
                height:'40px',
                borderRadius:'10px',
                margin:0 ,
                display:'flex'              
                }}>
            <input type='number' style={
                {
                    width:'85%',
                    border:'None',
                    fontSize:'20px',
                    fontWeight:'bold',
                    textAlign:'center'
                    
                }
            }
            onChange={(e)=>setReg(e.target.value)}/>
            <button onClick={handleSearch}>Search</button>
         </div>
        {/* Output Result */}
        {
            (res.DOBDATA.success || res.RESULTDATA.success) && <ResultCard res = {res}/>
        }

    </div>
  )
}
