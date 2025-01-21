const app = require('./app');
const cors = require('cors')
const bodyParser = require('body-parser')
const {readCSV , transformData , createTable , connectDatabase } = require('./src/database/dataFunctions')
const {insertResults} = require('./src/database/insertResults')
const {getDataMiddleware, getDataExamination, updateDateOfBirth, getResultSessions, addResultSessions} = require('./src/database/getData');
const { checkConnection } = require('./src/database/dataBaseConnection');
const { backupFunction } = require("./src/database/backupDatabase");
const fs = require('fs').promises;
const rateLimit = require('express-rate-limit');

app.use(cors());

app.use(bodyParser.json({ limit: '50mb' }));


// Test the database connection and create table if not exists
(async () => {
    await checkConnection();
})();

async function loadData() {
    try {
      const data = await fs.readFile('./constants.json', 'utf8');
      const resultSessionData = JSON.parse(data).sessions;
      return resultSessionData;
    } catch (err) {
      console.error({ message: "Error while reading File", error: err });
      return [];
    }
  }

// Rate limiter for `/getData/:REG_DOB` endpoint
const getDataLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1-minute window
    max: 5, // Limit each IP to 5 requests per window
    message: {
      success: false,
      error: 'Too many requests from this IP, please try again after 5 minutes.',
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });


// Students Frontend
app.get('/getData/:REG_DOB', async(req,res,next)=>{
    console.log(req.params.REG_DOB);
    const session = req.params.REG_DOB.split(',')[2];
    const resultSessionData = await loadData();
    if(!resultSessionData.includes(session)){
        return res.json({ success: false, error: 'write Session Properly' });
    }
    getDataMiddleware(req,res,next);
});

// app.get('/getData', async (req,res,next)=>{
//     console.log("trigger");
//     res.json({data:'Data'});
// });


// Examination Front End
app.post('/addFile', async (req, res, next) => {
    try {
        const csvData = req.body.csvData || req.body.data; // Handle both possible request body keys
        if (!csvData) {
            throw new Error('No CSV data provided');
        }
        
        // console.log("CSV DATA : ", csvData);
        const data = await readCSV(csvData);
        // console.log("readCSV DATA : ", data);
        const transformedData = await transformData(data);
        res.send(transformedData);
    } catch (error) {
        next(error);
    }
});

app.post('/addResult' , async (req, res, next) =>{
    try {
        const results = req.body;
        
        insertResults(results.data , results.session);
        res.status(200).send("Sucessfull")
    } catch (error) {
        next(error);
    }
})

app.get('/getSessions',getResultSessions)
app.post('/addSession',addResultSessions)

app.get('/:pass',async (req,res,next) =>{
    try{
        const pass = req.params.pass;
        if(pass === process.env.LOGIN_PASS){
            res.status(200).send({message:'Login Successfull'})
        }else{
            res.status(202).send({message:'Login Error'})
        }
    }catch(err){
        next(err)
    }
})


app.post('/examination/updateDateOfBirth' , updateDateOfBirth);
app.post('/examination/:RegNo' , getDataExamination);


// Catch-all route
app.get('*', (req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

// Create server
backupFunction();

app.listen(process.env.PORT, '192.168.124.197', () => {
    console.log(`Server is running on http://192.168.124.197:${process.env.PORT}`);
});

// app.listen(process.env.PORT, () => {
//     console.log(`Server is running on http://localhost:${process.env.PORT}`);
// });
