import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './fileupload.css'; // Assuming you have custom styles

const FileUpload = ({ handleFile }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        handleFile(data, file.name); // Pass file name to distinguish between types
      };
      reader.readAsArrayBuffer(file);
    }
  }, [handleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Allow only one file to be dropped at a time
    accept: ['.xlsx', '.xls', '.csv'] // Specify accepted file types as an array
  });

  return (
    <div className="file-upload-container">
      <div
        {...getRootProps({
          className: `dropzone ${isDragActive ? 'drag-active' : ''}`
        })}
      >
        <input {...getInputProps()} />
        <p>Drag and drop an Excel or CSV file here, or click to select one</p>
      </div>
    </div>
  );
};

export default FileUpload;
