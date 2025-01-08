import './App.css';
import AdminFrontPage from './components/frontPage/AdminFrontPage';
import { useEffect, useState } from 'react';
import ResultAnalysisPage from './components/resultAnalysisPage/ResultAnalysisPage';
import LoginPage from './components/LoginPage';

function App() {
  const [data,setData] = useState([]);
  const [frontPage,setFrontPage] = useState(true);
  const [login , setLogin] = useState(false);

  // useEffect(()=>{
  //   console.log(data);
  // },[data]);


  return (
    <div className="App">
      {!login && <LoginPage setLogin={setLogin}/>}
      {login && 
        <div>
          {/* <FetchDataButton /> */}
          {frontPage && <AdminFrontPage setData = {setData} setFrontPage={setFrontPage}/> }
          {!frontPage && <ResultAnalysisPage setData = {setData}  data= {data.data} error={data.error} setFrontPage={setFrontPage}/>}
        </div>
      }
    </div>
  );
}

export default App;
