import React from 'react';
import * as XLSX from 'xlsx';  // Import all functions from xlsx

const GenerateExcelButton = () => {
    const generateExcel = () => {
        // Sample data
        const sampleData = [
            {
                'ENROLEMENT NO': '1001', // Assuming this is unique for each student
                'STUDENT NAME': 'ABC',
                COLLEGE: 'ABC College',
                COURSE: 'Engineering',
                SEMESTER: 'Spring 2024',

                'Sub Code1': 'S101',
                'Sub Name1': 's1',
                'TCr1': '4',
                LG1: 'A', 
                GP1: '8.5',
                

                'Sub Code2': 'S102',
                'Sub Name2': 's2',
                'TCr2': '3',
                LG2: 'A-',
                GP2: '9.0',
                

                'Sub Code3': 'S103',           
                'Sub Name3': 's3',
                'TCr3': '3',
                LG3: 'B+',
                GP3: '7.5',
                
                STATUS: 'Pass',
                '% BASED ON SGPA': '85', // Assuming this is the percentage based on SGPA
                'EXAMINATION M/YR': 'May 2024'
            }];

        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sampleData);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample Data');

        // Generate Excel file and download
        XLSX.writeFile(workbook, 'sample_data.xlsx');
    };

    return (
        <div>
            <p style= {
                {
                    color:'white',
                    position:'absolute',
                    top:'10px',
                    right:'30px',
                    cursor:'pointer'
                }
            } onClick={generateExcel}>Download Sample Excel</p>
        </div>
    );
};

export default GenerateExcelButton;
