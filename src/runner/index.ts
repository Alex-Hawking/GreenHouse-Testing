const { spawn } = require('child_process');
const fs = require('fs');
const globals = require('../../../GreenHouse')

const jest = spawn('jest');
const now = new Date(); 

const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');

const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

const logName = `Test-${year}-${month}-${day}_${hours}-${minutes}-${seconds}`

let logFile: { write: (arg0: string | Uint8Array) => void; close: () => void; }

if (globals.saveLogs) {
    logFile = fs.createWriteStream(`./${logName}.log`, { flags: 'a' });
}

jest.stdout.on('data', (data: string | Uint8Array) => {
    process.stdout.write(data); 
    if (globals.saveLogs) {
        logFile.write(data); 
    }
});

jest.stderr.on('data', (data: string | Uint8Array) => {
    process.stderr.write(data);
    if (globals.saveLogs){
        logFile.write(data);
    }
});

jest.on('close', (code: number) => {
    if (globals.saveLogs) {
        logFile.close(); 
    }
    console.log(`Jest process exited with code ${code}`);
});