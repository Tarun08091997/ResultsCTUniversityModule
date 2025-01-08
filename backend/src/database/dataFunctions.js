
const csv = require('csv-parser');


// Updated readCSV function to handle CSV data from the request body
exports.readCSV = (csvData) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const readableStream = require('stream').Readable.from([csvData]);

        readableStream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
};

exports.transformData = async (data) => {
   const ErrorReg = [];
   let TotalError = 0;

   const checkError = (item , data , number , reg ) =>{
          if(typeof item[data] === 'undefined' || item[data] == "#REF!"){
            item[data] = "Error";
            TotalError++;
            ErrorReg.push(reg);
            return;
          }
          if(number && Number.isNaN(parseFloat(item[data]))){
            item[data] = "Error";
            TotalError++;
            ErrorReg.push(reg);
            return;
          }
   }

   const twoDigit = (num , dig) =>{
     if(isNaN(num.toFixed(dig))){
       return "Error";
     }
     
      return num.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
     
   }

    const transformedData = data.map(item => {
        const subjects = [];
        const subjectCodes = [];
        const subjectGPS = [];
        const subCredits = [];
        const subGrades = []
        let i = 1;
        while (item[`Sub Code${i}`] || item[`Sub Name${i}`]) {
            if (item[`Sub Code${i}`]) {
                checkError(item ,`Sub Code${i}` , false,item['ENROLEMENT NO']);
                subjectCodes.push(item[`Sub Code${i}`]);
            }
            if (item[`Sub Name${i}`]) {
              checkError(item ,`Sub Name${i}` , false,item['ENROLEMENT NO']);                
              subjects.push(item[`Sub Name${i}`]);
            }
            if (item[`GP${i}`]) {
              checkError(item ,`GP${i}`, true,item['ENROLEMENT NO']);
              subjectGPS.push(item[`GP${i}`]);
            }

            if(item[`TCr${i}`]) {
              checkError(item,`TCr${i}`, true,item['ENROLEMENT NO']);
              subCredits.push(item[`TCr${i}`]);
            }

            if (item[`LG${i}`]) {
              checkError(item,`LG${i}`, false,item['ENROLEMENT NO']);
              subGrades.push(item[`LG${i}`]);
            }


            i++;
        }

        checkError(item,'ENROLEMENT NO', true,item['ENROLEMENT NO']);
        checkError(item,'STUDENT NAME', false,item['ENROLEMENT NO']);
        checkError(item,'STATUS', false,item['ENROLEMENT NO']);
        checkError(item,'% BASED ON SGPA', true,item['ENROLEMENT NO']);


        return {
            'ENROLEMENT NO': item['ENROLEMENT NO'],
            studentName: item['STUDENT NAME'],
            COLLEGE: item.COLLEGE,
            COURSE: item.COURSE,
            semester: item.SEMESTER,
            subjectCodes: subjectCodes,
            subjects: subjects,
            gps: subjectGPS,
            grades:subGrades,
            credits:subCredits,
            status: item.STATUS,
            percentage: twoDigit(parseFloat(item['% BASED ON SGPA'],2)), // Show '% BASED ON SGPA' instead of SGPA
            sgpa:twoDigit(parseFloat(item['% BASED ON SGPA']/10),2),
            'EXAMINATION M/YR':item['EXAMINATION M/YR']
        };
    });

    return {'data':transformedData , 'error':{'err':ErrorReg , 'total' : TotalError}};
};

