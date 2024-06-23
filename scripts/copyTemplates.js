const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src', 'mail', 'templates');
const destDir = path.join(distDir, 'mail', 'templates');

// Function to check if the dist directory exists
function checkDistDir() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (fs.existsSync(distDir)) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

// Copy the templates after the dist directory is created
async function copyTemplates() {
  await checkDistDir();
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('Templates copied successfully');
}

copyTemplates().catch((err) => {
  console.error('Error copying templates:', err);
});
