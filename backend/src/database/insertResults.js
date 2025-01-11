const mysql = require('mysql2/promise'); // Ensure you have installed mysql2
const { backupFunction } = require("./backupDatabase");

async function insertResults(results,resultSession) {
    const pool = connectDatabase(); // Get MySQL connection pool

    const year = resultSession.split("_")[0]
    const term = resultSession.split("_")[1]
    const yt = term + " , " + year;

    const connection = await pool.getConnection();

    try {
        // Start transaction
        await connection.beginTransaction();

        // Iterate through each result and insert into 'result' table
        for (let item of results) {
            // Convert arrays to JSON strings
            const resultData = {
                enrollment_no: item['ENROLEMENT NO'],
                student_name: item['studentName'],
                college: item.COLLEGE,
                course: item.COURSE,
                semester: item.semester,
                subject_codes: JSON.stringify(item.subjectCodes),
                subjects: JSON.stringify(item.subjects),
                gps: JSON.stringify(item.gps),
                grades:JSON.stringify(item.grades),
                credits:JSON.stringify(item.credits),
                status: item.status,
                percentage: item.percentage,
                sgpa: item.sgpa,
                exam_month_year: yt   //item['EXAMINATION M/YR'] || 
            };

            // Insert the result record with ON DUPLICATE KEY UPDATE
            const insertQuery = `
                INSERT INTO ${resultSession} SET ?
                ON DUPLICATE KEY UPDATE
                    student_name = VALUES(student_name),
                    college = VALUES(college),
                    course = VALUES(course),
                    semester = VALUES(semester),
                    subject_codes = VALUES(subject_codes),
                    subjects = VALUES(subjects),
                    gps = VALUES(gps),
                    grades = VALUES(grades),
                    credits = VALUES(credits),
                    status = VALUES(status),
                    percentage = VALUES(percentage),
                    sgpa = VALUES(sgpa),
                    exam_month_year = VALUES(exam_month_year)
            `;

            await connection.query(insertQuery, resultData);
        }

        // Commit transaction
        await connection.commit();
        console.log('All results inserted successfully');
        backupFunction();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        console.error('Error inserting results:', error);
        throw error;
    } finally {
        connection.release();
    }
}

function connectDatabase() {
    // MySQL connection pool
    const pool = mysql.createPool({
        host: process.env.HOST,
        port: process.env.SQL_PORT,
        user: process.env.USER,
        password: process.env.PASS,
        database: process.env.DATABASE,
        waitForConnections: true,
        connectionLimit: process.env.CONNECTION_LIMIT,
        queueLimit: 0
    });

    return pool;
}

module.exports = { insertResults };