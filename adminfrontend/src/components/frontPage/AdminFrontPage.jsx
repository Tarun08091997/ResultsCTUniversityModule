import React, { useState } from 'react';
import FileUpload from './FileUpload';
import * as XLSX from 'xlsx';
import axios from 'axios'; // Import Axios
import NavBar from '../NavBar';
import { HOST } from '../constants';
import CheckResult from './CheckResult';
import SelectSession from '../SelectSession';

const AdminFrontPage = ({setData , setFrontPage , setSelectedSession , selectedSession}) => {


  const [uploadFilePage , setUploadFilePage] = useState(true);
  

  const handleFile = (data, fileName) => {
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const csvData = XLSX.utils.sheet_to_csv(firstSheet);
      if(csvData){
        console.log('CSV Data we are Getting : \n', csvData)
        // Send CSV data to backend using Axios
        axios.post(`${HOST}/addFile`, { 'data' : csvData})
          .then(response => {
            console.log('Data taken from CSV File :', response.data);
            setData(response.data);
            // console.log(response.data);
            setFrontPage(false);
            // Handle success response if needed
          })
          .catch(error => {
            console.error('Error uploading file:', error);
            // Handle error
          });
      }
      else{
        alert("can't convert to CSV data please convert to CSV then provide it")
      }
    } else if (fileName.endsWith('.csv')) {
      // Handle CSV file
      const textDecoder = new TextDecoder('utf-8');
      const decodedData = textDecoder.decode(data);

      // Send CSV data to backend using Axios
      axios.post(`${HOST}/addFile`, { csvData: decodedData })
        .then(response => {
          // console.log('File uploaded successfully:', response.data);
          setData(response.data);
          setFrontPage(false);
          // Handle success response if needed
        })
        .catch(error => {
          console.error('Error uploading file:', error);
          // Handle error
        });
    } else {
      console.error('Unsupported file type');
      return;
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      display:'flex',
      flexDirection:'column'
    }}>
      <NavBar uploadFilePage={uploadFilePage} setUploadFilePage={setUploadFilePage}/>
      <SelectSession setSession = {setSelectedSession} />
      {uploadFilePage && <FileUpload handleFile={handleFile} />}
      {!uploadFilePage && <CheckResult selectedSession = {selectedSession}/>}
    </div>
  );
};

export default AdminFrontPage;
