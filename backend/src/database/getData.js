const mysql = require('mysql2/promise');
const { checkAuthenticity } = require('../checkAuthenticity');
const { getConnection, createTable } = require('./dataBaseConnection');
const fs = require('fs').promises;

exports.getDataMiddleware = async (req, res, next) => {
  const body = req.params.REG_DOB.split(',');
  console.log(body);

  let connection;
  try {
      // Get a connection from the pool
      connection = await getConnection();

      const resp = await checkAuthenticity(body, connection);
      if (!resp.login) {
          return res.json({ success: false, error: 'Your Registration Number or Date Of Birth is wrong' });
      }

      const regNo = body[0];
      const session = body[2];

      // Query to fetch data based on enrollment number
      const query = `SELECT * FROM ${session} WHERE enrollment_no = ?`;
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


exports.getDataExamination = async (req, res, next) => {
    const RegNo = req.params.RegNo;
    const { session } = req.body;

    let connection;

    try {
        // Get a connection from the pool
        connection = await getConnection();

        // Initialize the result object
        const result = {
            DOBDATA: { success: false },
            RESULTDATA: { success: false }
        };

        // Query to get DOB data
        const dobQuery = 'SELECT * FROM dobdata WHERE REG = ?';
        const [dobData] = await connection.query(dobQuery, [RegNo]);

        // If DOB data exists
        if (dobData.length > 0) {
            result.DOBDATA = {
                success: true,
                DOB: dobData[0].DOB
            };
        }

        // Query to fetch examination data (ensure table exists)
        const query = `SELECT * FROM ?? WHERE enrollment_no = ?`;
        const [rows] = await connection.query(query, [session, RegNo]);

        // If no examination data exists
        if (rows.length === 0) {
            return res.status(200).json(result);
        }

        // Construct response for the examination data
        const data = rows[0];
        result.RESULTDATA = {
            success: true,
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

        res.status(200).json(result);

    } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
            console.error(`Table "${session}" does not exist:`, error);

            // Send a specific error response for missing table
            res.status(400).json({
                success: false,
                message: `The session "${session}" does not exist. Please provide a valid session.`,
            });
        } else {
            console.error('Error fetching data:', error);

            // Generic error response
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching the data. Please try again later.',
                error: error.message
            });
        }
    } finally {
        // Ensure the connection is released back to the pool
        if (connection) connection.release();
    }
};


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


exports.getResultSessions = async (req, res, next) => {
    try {
        // const filePath = path.join(__dirname, './constants.json'); // Adjust the relative path based on file location
        const data = await fs.readFile('./constants.json', 'utf8');
        const obj = JSON.parse(data);
        res.status(200).json(obj);
    } catch (err) {
        res.status(400).json({"message":"Error while reading File" , "error" : err}) // Pass the error to the error-handling middleware
    }
};


exports.addResultSessions = async (req, res, next) => {
    try {
        console.log("data")
        // Read the existing data from constants.json
        const data = await fs.readFile('./constants.json', 'utf8');
        const obj = JSON.parse(data);

        // Validate if "sessions" exists and is an array
        if (!Array.isArray(obj.sessions)) {
            return res.status(400).json({ message: "Invalid data format in constants.json" });
        }

        // Get the new session from the request body
        const { newSession } = req.body;
        if (!newSession || typeof newSession !== 'string') {
            return res.status(400).json({ message: "Invalid input: newSession must be a non-empty string" });
        }

        createTable(newSession);

        // Add the new session at the beginning of the sessions array
        obj.sessions.unshift(newSession);

        // Write the updated object back to constants.json
        await fs.writeFile('./constants.json', JSON.stringify(obj, null, 2), 'utf8');

        // Respond with the updated sessions
        res.status(200).json({ message: "Session added successfully", sessions: obj.sessions });
    } catch (err) {
        console.log("Error")
        res.status(500).json({ message: "Error while updating sessions", error: err });
    }
};

