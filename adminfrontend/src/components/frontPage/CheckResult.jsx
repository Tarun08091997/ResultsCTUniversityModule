import React, { useState } from 'react';
import axios from 'axios'
import { HOST } from '../constants';
import ResultCard from './ResultCard';

export default function CheckResult() {

    const [reg,setReg] = useState('');
    const [res , setRes] = useState({
        DOBDATA : {success:false},
        RESULTDATA:{success:false}
      });
    const handleSearch = async() =>{
        if(reg.length === 8){
            const resp = await axios.get(`${HOST}/examination/${reg}`);
            if(resp && resp.data){
                setRes(resp.data);
            }
        }
        else{
            alert("Give Proper Reg Number")
        }
    }

  return (
    <div style={{position:'absolute', top:'100px'}}>
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
