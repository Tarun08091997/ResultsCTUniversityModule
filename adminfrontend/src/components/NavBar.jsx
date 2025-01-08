import React from 'react'
import logo from '../Assets/images/Ct_logo.png';
import GenerateExcelButton from './GenerateExcelButton';


export default function NavBar({setUploadFilePage , uploadFilePage}) {
  return (
    <div className='navbar' style={
      {
        width:'100vw',
        backgroundColor:'#2563eb',
        position:'absolute',
        top:0,
        left:0,
        height:'75px',
        display:'flex'
      }
    }>
      <img src={logo} alt='CT Logo' style={
        {
          width:'5%',
          marginLeft:'50%'
        }
      }/>

      <div style={
        {
          color:'white',
          marginLeft:'12%',
          marginTop:'25px',
          cursor:'pointer'
        }
      } onClick={() => setUploadFilePage(!uploadFilePage)}>{uploadFilePage ? 'Check Result' : 'Upload File'}</div>
      <GenerateExcelButton />
      

    </div>
  )
}
