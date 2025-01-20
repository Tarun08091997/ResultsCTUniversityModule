import  {  useEffect, useState } from 'react';
import logo from '../assets/images/Ct_logo.png';
import axios from 'axios'
import SelectSession from './SelectSession';

const FrontPage = ({setFrontPage , setCertificateData}) => {
    const [rollNo , setRollNo] = useState('');
    const [dob , setDOB] = useState('');
    const [msg , setMessage] = useState('Fill the Data Properly')
    const [trigger , setTrigger] = useState(false);
    const [session,setSession] = useState("");
    const [disableSearch , setDisableSearch] = useState(true);

    

    const handleDate = (date) => {
      const [y, m, d] = date.split(/[\/.-]/);
    
      // Ensure valid year, month, and day
      if (y.length !== 4 || m < 1 || m > 12 || d < 1 || d > 31) {
        alert("Invalid date format or values!");
        return;
      }
    
      // Validate that the day exists for the given month
      const isValidDate = new Date(`${y}-${m}-${d}`).getDate() == d;
      if (!isValidDate) {
        alert("Invalid day for the given month/year!");
        return;
      }
    
      setDOB(`${d}-${m}-${y}`);
    };

    const fetchCertificateData = async (regNo,DOB) => {
      try {
        const REG_DOB = regNo + ',' + DOB +',' + session;
        const response = await axios.get(`/api/getData/${REG_DOB}`)
        // const response = await axios.get(`http://localhost:4000/getData/${REG_DOB}`)
        
        if (response.data.success) {
          setCertificateData(response.data.data);
          return false;
        } else{
          
           setMessage(response.data.error)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage(response.data.error)
      }
      setTrigger(true);
      return true;
    };


    useEffect(() => {
      if (trigger) {
          const timer = setTimeout(() => {
              setTrigger(false);
          }, 2000); // Change 3000 to the number of milliseconds you want the notification to be visible

          return () => clearTimeout(timer);
      }
  }, [trigger, setTrigger]);

    const handleSearch = async () =>{
        if(rollNo.length === 8 || rollNo.length == 10){
            const frontPage = await fetchCertificateData(rollNo,dob);
            setFrontPage(frontPage);
        }
        else{
          alert("Give proper Registration Number");
        }
    }
  return (
    <div className="min-h-screen bg-gray-100">
      {trigger && <div className='absolute top-[100px] right-[10px] p-4 bg-yellow-300 rounded-2xl font-semibold' >
           {msg}
      </div>}
      {/* Top bar with university name and logo */}
      <div className="p-4 flex items-center justify-between bg-blue-600">
        <div className="flex items-center w-full">
          <img src={logo} alt="CT University Logo" className="w-10 sm:w-[65px] sm:ml-5" />
          <h1 className="text-xl font-bold text-white text-center flex-grow text-[10px] sm:text-[20px]">CT University Results</h1>
        </div>
      </div>
      {/* Main content section */}
      <div className="flex flex-col items-center w-[70%] md:w-[30%] justify-center top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 absolute ">
        <SelectSession setDisableSearch={setDisableSearch} setSession={setSession}/>
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            
          <div className="mb-4 p-2">
            
            <label className="block text-gray-700 font-semibold mb-1">
              Registration Number
            </label>
            <input
              type="text"
              id="enrollment-number"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Registration number"
              onChange={(e)=>{setRollNo(e.target.value)}}
            />

            <label className="block mt-2 text-gray-700 font-semibold mb-1">
              Date of Birth
            </label>

            <input
              type='date'
              id="dateOfBirth"
              className="w-full px-3  py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Date of Birth"
              onChange={(e)=>{handleDate(e.target.value)}}
            />

          </div>

          <button className={`w-full  text-white py-2 rounded ${disableSearch ? "bg-gray-500":" bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"} `}
          disabled={disableSearch}
          onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default FrontPage;
