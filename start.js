const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting MediTrack - Medical Expense Tracker...');

// Check if node_modules exists in client and server directories
const clientNodeModulesPath = path.join(__dirname, 'client', 'node_modules');
const serverNodeModulesPath = path.join(__dirname, 'server', 'node_modules');

if (!fs.existsSync(clientNodeModulesPath)) {
  console.log('Client dependencies not found. Installing...');
  console.log('This may take a few minutes. Please wait...');
  
  const clientInstall = spawn('npm', ['install'], { 
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
  });
  
  clientInstall.on('close', (code) => {
    if (code !== 0) {
      console.error('Failed to install client dependencies');
      process.exit(1);
    }
    console.log('Client dependencies installed successfully!');
    checkServerDependencies();
  });
} else {
  checkServerDependencies();
}

function checkServerDependencies() {
  if (!fs.existsSync(serverNodeModulesPath)) {
    console.log('Server dependencies not found. Installing...');
    
    const serverInstall = spawn('npm', ['install'], { 
      cwd: path.join(__dirname, 'server'),
      stdio: 'inherit',
      shell: true
    });
    
    serverInstall.on('close', (code) => {
      if (code !== 0) {
        console.error('Failed to install server dependencies');
        process.exit(1);
      }
      console.log('Server dependencies installed successfully!');
      startApplication();
    });
  } else {
    startApplication();
  }
}

function startApplication() {
  console.log('Starting server...');
  const server = spawn('npm', ['run', 'dev'], { 
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: true
  });
  
  // Wait a bit for the server to start before launching the client
  setTimeout(() => {
    console.log('Starting client...');
    const client = spawn('npm', ['start'], { 
      cwd: path.join(__dirname, 'client'),
      stdio: 'inherit',
      shell: true
    });
    
    client.on('close', (code) => {
      console.log('Client process exited with code', code);
      server.kill();
    });
  }, 2000);
  
  console.log('\nMediTrack is starting up!');
  console.log('The client will open automatically in your default browser.');
  console.log('If it doesn\'t open, navigate to: http://localhost:3000');
}
