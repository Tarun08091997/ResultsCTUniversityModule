const mysql = require('mysql2/promise');


exports.checkAuthenticity= async(body , connection)=>{
    const [s_REG , s_DOB] = body; // Assuming regNo is passed as a route parameter
    try {
        // Query to fetch data based on enrollment number
        const query = 'SELECT * FROM dobdata WHERE REG = ? AND DOB = ?';
        const [rows] = await connection.query(query, [s_REG, s_DOB]);
            
        // Check if data exists for the given enrollment number
        if (rows.length === 0) {
            return {login:false, error: 'Incorrect Data or Data does not exist.' };
        }else{
            return {login:true };
        }
    }catch(err){
        console.error('Error fetching data:', err);
        return({login:false , error: 'Failed to fetch data' });
    }
}