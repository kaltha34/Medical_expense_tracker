const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  clientBuildPath: path.join(__dirname, 'client', 'build'),
  serverPath: path.join(__dirname, 'server'),
  deploymentTarget: process.env.DEPLOYMENT_TARGET || 'local' // Options: local, netlify, heroku
};

console.log('Starting deployment process...');

// Build the client
console.log('Building React client...');
try {
  execSync('npm run build', { cwd: path.join(__dirname, 'client'), stdio: 'inherit' });
  console.log('Client build successful!');
} catch (error) {
  console.error('Error building client:', error);
  process.exit(1);
}

// Prepare for deployment based on target
if (config.deploymentTarget === 'local') {
  console.log('Preparing for local deployment...');
  console.log('To run the application locally:');
  console.log('1. Start the server: npm run server');
  console.log('2. The server will serve the static files from the client build directory');
  console.log('3. Access the application at http://localhost:5000');
} else if (config.deploymentTarget === 'netlify') {
  console.log('Preparing for Netlify deployment...');
  console.log('To deploy to Netlify:');
  console.log('1. Make sure you have the Netlify CLI installed: npm install -g netlify-cli');
  console.log('2. Run: netlify deploy');
} else if (config.deploymentTarget === 'heroku') {
  console.log('Preparing for Heroku deployment...');
  console.log('To deploy to Heroku:');
  console.log('1. Make sure you have the Heroku CLI installed');
  console.log('2. Run: heroku create');
  console.log('3. Run: git push heroku main');
}

console.log('Deployment preparation complete!');
