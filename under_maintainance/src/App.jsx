import './App.css';

function App() {
  return (
    <div
      style={
        { 
          width:'100vw',
          Height:'100vh',
          backgroundColor: 'white',
          
        }
      }>

      <div style={{position:'absolute',textAlign:'center',top:'50%',left:'50%' , transform:'translate(-50%,-50%)'}}>
        <h1 style={{ fontSize: '2.5rem', color: '#343a40', fontWeight: 'bold', marginBottom: '1rem' }}>We'll be back soon!</h1>
        <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '0.5rem' }}>Sorry for the inconvenience but we’re performing some maintenance at the moment. We’ll be back online shortly!</p>
        <p style={{ color: '#adb5bd' }}>&mdash; CT University</p>
      </div> 
      
    </div>
  );
}

export default App;

