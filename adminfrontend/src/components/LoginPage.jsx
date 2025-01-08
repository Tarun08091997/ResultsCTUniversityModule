import React, { useState } from 'react'
import axios from 'axios'
import {HOST} from './constants'
export default function LoginPage({setLogin}) {
    const [pass,setPass] = useState();
    const handleLogin = async () =>{
        const resp = await axios.get(`${HOST}/${pass}`);
        if(resp.status === 200){
            setLogin(true);
        }else{
            setLogin(false);
            alert(resp.data.message);
        }
    }
  return (
    <div style={
        {
            width:'300px',
            height:'200px',
            border:'2px solid gray',
            position:'absolute',
            top:'50%',
            left:'50%',
            transform:'translate(-50%,-50%)',
            borderRadius:'30px',
            boxShadow:'1px 1px 10px 1px black',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            justifyContent:'center'
        }
    }>
        <input type='text' style={
            {
               width:'70%',
               height:'25px',
               border:'2px solid #007bff',
               borderRadius:'10px',
               fontWeight:'bold',
               padding:'10px',
               outline:'none'
            }
        } onChange={(e)=>setPass(e.target.value)}/>
        <button style={
            {
                width:'30%',
                margin:'20px',
                border:'5px'
            }
        } onClick={handleLogin}>Login</button>
    </div>
  )
}
