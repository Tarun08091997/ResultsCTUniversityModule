// connectionPool.js
const mysql = require('mysql2/promise');

// Initialize the connection pool as a singleton
const pool = mysql.createPool({
    host: process.env.HOST,
    port: process.env.SQL_PORT,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.CONNECTION_LIMIT, 100), // Ensure the limit is an integer
    queueLimit: 0
});

const createTable = async () => {
    // Create 'result' table if it doesn't exist
    const createTableQuery = `CREATE TABLE IF NOT EXISTS result(
        enrollment_no VARCHAR(255) NOT NULL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        college VARCHAR(255) NOT NULL,
        course VARCHAR(255) NOT NULL,
        semester VARCHAR(255) NOT NULL,
        subject_codes JSON,
        subjects JSON,
        gps JSON,
        grades JSON,
        credits JSON,
        status VARCHAR(50) NOT NULL,
        percentage DECIMAL(5, 2) NOT NULL,
        sgpa DECIMAL(5, 2) NOT NULL,
        exam_month_year VARCHAR(50) NOT NULL
    )`;

    try {
        const [result] = await pool.query(createTableQuery);
        console.log('Table "result" created or already exists');
    } catch (err) {
        console.error('Error creating table:', err);
    }
};

exports.checkConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        connection.release(); // Release the connection back to the pool
        await createTable();
    } catch (err) {
        console.error('Error connecting to MySQL database:', err);
        throw err; // Throw error to terminate application or handle appropriately
    }
};

// Export a function to get a connection from the pool
exports.getConnection = async () => {
    return await pool.getConnection();
};
