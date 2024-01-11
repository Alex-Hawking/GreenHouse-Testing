const { spawn } = require('child_process');

const bddPath = process.argv[2];

function runCommand(command) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { shell: true, stdio: 'inherit' });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command}" failed with exit code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    await runCommand('npm run build');
    await runCommand('npm run compile ' + bddPath);
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

main();
