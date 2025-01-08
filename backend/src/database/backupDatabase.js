// backup.js
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define the relative path where the backup will be saved
const filePath = '../../BackupDataFolder';

// Backup function
const backupDatabase = async () => {
    // Define the backup file name
    const backupFileName = `backupFile.sql`;

    // Resolve the full path to save the backup file
    const backupDirectory = path.resolve(__dirname, filePath);
    const backupFilePath = path.join(backupDirectory, backupFileName);

    // Ensure the backups directory exists
    if (!fs.existsSync(backupDirectory)) {
        fs.mkdirSync(backupDirectory, { recursive: true }); // Create the directory recursively
    }

    // Escape the backup file path for shell command
    const escapedBackupFilePath = `"${backupFilePath}"`;

    // Build the mysqldump command
    const dumpCommand = `mysqldump -h ${process.env.HOST} -P ${process.env.SQL_PORT} -u ${process.env.USER} -p${process.env.PASS} ${process.env.DATABASE} > ${escapedBackupFilePath}`;

    return new Promise((resolve, reject) => {
        // Execute the mysqldump command
        exec(dumpCommand, (error, stdout, stderr) => {
            if (error) {
                console.error('Error creating database backup:', error);
                reject(error);
            } else {
                console.log('Database backup created successfully:', backupFilePath);
                resolve(backupFilePath);
            }
        });
    });
};

// Wrapper function to execute the backup
const backupFunction = async () => {
    try {
        await backupDatabase(); // Create a backup
    } catch (error) {
        console.error('Error:', error);
    }
};

module.exports = { backupFunction };
