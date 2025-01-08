const mysql = require('mysql2/promise');
const { checkAuthenticity } = require('../checkAuthenticity');
const { getConnection } = require('./dataBaseConnection');



exports.getDataMiddleware = async (req, res, next) => {
  const body = req.params.REG_DOB.split(',');

  let connection;
  try {
      // Get a connection from the pool
      connection = await getConnection();

      const resp = await checkAuthenticity(body, connection);
      if (!resp.login) {
          return res.json({ success: false, error: 'Your Registration Number or Date Of Birth is wrong' });
      }

      const regNo = body[0];

      // Query to fetch data based on enrollment number
      const query = 'SELECT * FROM result WHERE enrollment_no = ?';
      const [rows] = await connection.query(query, [regNo]);

      // Check if data exists for the given enrollment number
      if (rows.length === 0) {
          return res.json({ success: false, error: 'Your result is still not declared. Kindly check after some days for further updates.' });
      }

      // Assuming there's only one result since enrollment number is unique
      const data = rows[0];

      // Construct the response object as needed
      const responseData = {
          ENROLLMENT_NO: data.enrollment_no,
          STUDENT_NAME: data.student_name,
          COLLEGE: data.college,
          COURSE: data.course,
          SEMESTER: data.semester,
          SUBJECT_CODES: data.subject_codes,
          SUBJECTS: data.subjects,
          GPS: data.gps,
          CREDITS: data.credits,
          GRADES: data.grades,
          STATUS: data.status,
          PERCENTAGE: data.percentage,
          SGPA: data.sgpa,
          EXAM_MONTH_YEAR: data.exam_month_year
      };

      res.json({ success: true, data: responseData });
  } catch (error) {
      console.error('Error fetching data:', error);
      res.json({ success: false, error: 'Your result is still not declared. Kindly check after some days for further updates.' });
  } finally {
      if (connection) connection.release(); // Release the connection back to the pool
  }
};

exports.getDataExamination = async(req,res,next)=>{
    const RegNo = req.params.RegNo;

  let connection;
  try {
      // Get a connection from the pool
      connection = await getConnection();

      // Get DOB data
      const dobQuery = 'SELECT * FROM dobdata WHERE REG = ?'
      const [dobData] = await connection.query(dobQuery, [RegNo]);

      const result = {
        DOBDATA : {success:false},
        RESULTDATA:{success:false}
      }
      
      // If we have DOB Data
      if(dobData.length != 0){
        result.DOBDATA = {
            success : true,
            DOB:dobData[0].DOB
        }
      }

     
      // Query to fetch data based on enrollment number
      const query = 'SELECT * FROM result WHERE enrollment_no = ?';
      const [rows] = await connection.query(query, [RegNo]);

      // Check if data exists for the given enrollment number
      if (rows.length === 0) {
          return res.json(result);
      }

      // Assuming there's only one result since enrollment number is unique
      const data = rows[0];

      // Construct the response object as needed
      const responseData = {
          success:true,
          ENROLLMENT_NO: RegNo,
          STUDENT_NAME: data.student_name,
          COLLEGE: data.college,
          COURSE: data.course,
          SEMESTER: data.semester,
          SUBJECT_CODES: data.subject_codes,
          SUBJECTS: data.subjects,
          GPS: data.gps,
          CREDITS: data.credits,
          GRADES: data.grades,
          STATUS: data.status,
          PERCENTAGE: data.percentage,
          SGPA: data.sgpa,
          EXAM_MONTH_YEAR: data.exam_month_year
      };

      result.RESULTDATA = responseData;
      res.json(result);
  } catch (error) {
      console.error('Error fetching data:', error);
  } finally {
      if (connection) connection.release(); // Release the connection back to the pool
  }
}

exports.updateDateOfBirth = async (req, res, next) => {
    const { REG, DOB } = req.body;

    let connection;
    try {
        // Get a connection from the pool
        connection = await getConnection();

        // Check if the record exists
        const [rows] = await connection.query('SELECT * FROM dobdata WHERE REG = ?', [REG]);

        if (rows.length > 0) {
            // If the record exists, update the existing record
            const updateQuery = 'UPDATE dobdata SET DOB = ? WHERE REG = ?';
            await connection.query(updateQuery, [DOB, REG]);
            res.send('Date of Birth updated successfully.');
        } else {
            // If the record does not exist, insert a new record
            const insertQuery = 'INSERT INTO dobdata (REG, DOB) VALUES (?, ?)';
            await connection.query(insertQuery, [REG, DOB]);
            res.send('Date of Birth added successfully.');
        }
    } catch (error) {
        console.error('Error updating/adding Date of Birth:', error);
        res.send("Problem while Updating/Adding");
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
};
