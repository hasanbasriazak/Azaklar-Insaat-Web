#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ftp from 'basic-ftp';
import Client from 'ssh2-sftp-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Deploy configurations
const config = {
  frontend: {
    host: '94.73.149.144',
    username: 'azaklar',
    password: '@n9d5dy94pmtAkWjU',
    remoteDir: '/',
    localDir: './dist'
  },
  api: {
    host: '94.73.149.144',
    username: 'azaklarapi',
    password: '@n9d5dy94pmtAkWjU',
    remoteDir: '/',
    localDir: './api-deploy/AzaklarApi'
  },
  admin: {
    host: '94.73.149.144',
    username: 'azaklaradmin',
    password: '@n9d5dy94pmtAkWjU',
    remoteDir: '/',
    localDir: './admin-deploy'
  }
};

console.log('🚀 Azaklar İnşaat Deploy Script');
console.log('================================');

async function uploadToSFTP(serverConfig, localPath, description) {
  const sftp = new Client();
  
  try {
    console.log(`\n📤 Uploading ${description} via SFTP...`);
    console.log(`Server: ${serverConfig.host}`);
    console.log(`Username: ${serverConfig.username}`);
    
    await sftp.connect({
      host: serverConfig.host,
      port: 22,
      username: serverConfig.username,
      password: serverConfig.password,
      readyTimeout: 30000,
      retries: 3,
      retry_factor: 2,
      retry_minTimeout: 2000
    });
    
    console.log('✅ SFTP connection established');
    
    // Upload files recursively
    await sftp.uploadDir(localPath, serverConfig.remoteDir);
    
    console.log(`✅ ${description} uploaded successfully via SFTP!`);
    return true;
    
  } catch (error) {
    console.error(`❌ ${description} SFTP upload failed:`, error.message);
    return false;
  } finally {
    await sftp.end();
  }
}

async function uploadToFTP(serverConfig, localPath, description) {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  
  try {
    console.log(`\n📤 Uploading ${description} to FTP...`);
    console.log(`Server: ${serverConfig.host}`);
    console.log(`Username: ${serverConfig.username}`);
    
    await client.access({
      host: serverConfig.host,
      user: serverConfig.username,
      password: serverConfig.password,
      secure: false
    });
    
    console.log('✅ FTP connection established');
    
    // Recursive function to upload files one by one
    const uploadDirectoryRecursive = async (localDir, remoteDir = '/') => {
      const items = fs.readdirSync(localDir, { withFileTypes: true });
      let uploadedCount = 0;
      let failedCount = 0;
      
      for (const item of items) {
        const localItemPath = path.join(localDir, item.name);
        const remoteItemPath = path.join(remoteDir, item.name).replace(/\\/g, '/');
        
        try {
          if (item.isDirectory()) {
            // Create directory first
            console.log(`📁 Creating directory: ${item.name}`);
            await client.ensureDir(remoteItemPath);
            
            // Upload contents of directory
            const subResult = await uploadDirectoryRecursive(localItemPath, remoteItemPath);
            uploadedCount += subResult.uploadedCount;
            failedCount += subResult.failedCount;
          } else {
            // Upload single file
            console.log(`📄 Uploading file: ${item.name}`);
            await client.uploadFrom(localItemPath, remoteItemPath);
            uploadedCount++;
            
            // Small delay between files
            await new Promise(resolve => setTimeout(resolve, 150));
          }
        } catch (error) {
          console.log(`⚠️  Failed to upload: ${item.name} (${error.message})`);
          failedCount++;
          
          // If connection lost, try to reconnect
          if (error.message.includes('ECONNRESET') || error.message.includes('EPIPE')) {
            console.log('🔄 Reconnecting to FTP...');
            try {
              await client.access({
                host: serverConfig.host,
                user: serverConfig.username,
                password: serverConfig.password,
                secure: false
              });
              console.log('✅ FTP reconnected');
            } catch (reconnectError) {
              console.log(`❌ Failed to reconnect: ${reconnectError.message}`);
              break;
            }
          }
        }
      }
      
      return { uploadedCount, failedCount };
    };
    
    const result = await uploadDirectoryRecursive(localPath);
    
    console.log(`✅ ${description} upload completed!`);
    console.log(`   📤 Uploaded: ${result.uploadedCount} files`);
    if (result.failedCount > 0) {
      console.log(`   ⚠️  Failed: ${result.failedCount} files`);
    }
    
    return result.failedCount === 0;
    
  } catch (error) {
    console.error(`❌ ${description} upload failed:`, error.message);
    return false;
  } finally {
    client.close();
  }
}

async function deployFrontend() {
  console.log('📦 Building frontend...');
  
  try {
    const { execSync } = await import('child_process');
    
    // Clean and build
    console.log('🧹 Cleaning old build...');
    if (fs.existsSync('./dist')) {
      fs.rmSync('./dist', { recursive: true, force: true });
    }
    
    console.log('🔨 Building production version...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Remove unnecessary asset folders after build
    console.log('🗑️ Removing unnecessary asset folders...');
    const unnecessaryFolders = [
      './dist/assets/bagcilar_meydan_life',
      './dist/assets/fatih_gulbahce_konagi', 
      './dist/assets/haznedar_park'
    ];
    
    unnecessaryFolders.forEach(folder => {
      if (fs.existsSync(folder)) {
        fs.rmSync(folder, { recursive: true, force: true });
        console.log(`   ✓ Removed: ${folder}`);
      }
    });
    
    // Note: Using HashRouter instead of server-side routing
    console.log('   ✓ Using HashRouter for client-side routing');
    
    console.log('✅ Frontend build completed!');
    
    // Show build summary
    const distFiles = fs.readdirSync('./dist');
    console.log('\n📋 Frontend build contents:');
    distFiles.forEach(file => {
      const filePath = path.join('./dist', file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`   ${file} (${size} KB)`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Frontend build failed:', error.message);
    return false;
  }
}

async function deployAPI() {
  console.log('\n📦 Preparing .NET API deployment...');
  
  try {
    const { execSync } = await import('child_process');
    
    // Build .NET API in release mode as self-contained
    console.log('🔨 Building .NET API in Release mode (self-contained)...');
    execSync('dotnet publish AzaklarApi -c Release -r win-x64 --self-contained true -o ./api-deploy/AzaklarApi-self-contained', { stdio: 'inherit' });
    
    // Copy additional files
    console.log('📁 Copying additional files...');
    
    // Create web.config for IIS
    const webConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
    </handlers>
    <aspNetCore processPath="AzaklarApi.exe" arguments="" stdoutLogEnabled="true" stdoutLogFile=".\\logs\\stdout" hostingModel="inprocess" />
  </system.webServer>
</configuration>`;
    
    fs.writeFileSync('./api-deploy/AzaklarApi-self-contained/web.config', webConfigContent);
    console.log('   ✓ web.config for IIS created');
    
    // Create startup script
    const startupScript = `@echo off
echo Starting Azaklar Insaat API...
AzaklarApi.exe
`;
    fs.writeFileSync('./api-deploy/AzaklarApi-self-contained/start.bat', startupScript);
    console.log('   ✓ start.bat created');
    
    // Use self-contained package
    config.api.localDir = './api-deploy/AzaklarApi-self-contained';
    
    console.log('✅ .NET API self-contained deployment package ready!');
    return true;
    
  } catch (error) {
    console.error('❌ .NET API build failed:', error.message);
    return false;
  }
}

async function deployAdmin() {
  console.log('\n📦 Preparing Admin Panel deployment...');
  
  try {
    const { execSync } = await import('child_process');
    
    // Change to admin directory
    console.log('🔨 Building Admin Panel...');
    process.chdir('./AzaklarAdmin');
    
    // Clean and build
    console.log('🧹 Cleaning old build...');
    if (fs.existsSync('./dist')) {
      fs.rmSync('./dist', { recursive: true, force: true });
    }
    
    console.log('🔨 Building production version...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Copy to admin-deploy directory
    const adminDeployDir = '../admin-deploy';
    if (fs.existsSync(adminDeployDir)) {
      fs.rmSync(adminDeployDir, { recursive: true, force: true });
    }
    fs.mkdirSync(adminDeployDir, { recursive: true });
    
    // Copy dist contents to admin-deploy
    execSync(`cp -r dist/* ${adminDeployDir}/`, { stdio: 'inherit' });
    
    // Go back to root directory
    process.chdir('..');
    
    console.log('✅ Admin Panel build completed!');
    
    // Show build summary
    const adminFiles = fs.readdirSync('./admin-deploy');
    console.log('\n📋 Admin Panel build contents:');
    adminFiles.forEach(file => {
      const filePath = path.join('./admin-deploy', file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      console.log(`   ${file} (${size} KB)`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Admin Panel build failed:', error.message);
    return false;
  }
}

function showDeployInstructions() {
  console.log('\n🌐 Manual FTP Upload Instructions:');
  console.log('==================================');
  
  console.log('\n🖥️  FRONTEND (Website):');
  console.log(`Server: ${config.frontend.host}`);
  console.log(`Username: ${config.frontend.username}`);
  console.log(`Password: ${config.frontend.password}`);
  console.log(`Upload: ${config.frontend.localDir}/* → ${config.frontend.remoteDir}`);
  
  console.log('\n🔌 BACKEND (API):');
  console.log(`Server: ${config.api.host}`);
  console.log(`Username: ${config.api.username}`);
  console.log(`Password: ${config.api.password}`);
  console.log(`Upload: ./api-deploy/* → ${config.api.remoteDir}`);
  
  console.log('\n👨‍💻 ADMIN PANEL:');
  console.log(`Server: ${config.admin.host}`);
  console.log(`Username: ${config.admin.username}`);
  console.log(`Password: ${config.admin.password}`);
  console.log(`Upload: ./admin-deploy/* → ${config.admin.remoteDir}`);
  
  console.log('\n📝 Deployment Steps:');
  console.log('1. Frontend: Upload ./dist/* to u7386832 account');
  console.log('2. API: Upload ./api-deploy/* to apiazaklaryapi account');
  console.log('3. Admin: Upload ./admin-deploy/* to adminazaklar account');
  console.log('4. API: Run "npm install --production" on server');
  console.log('5. API: Run "npm start" to start the API server');
  console.log('6. Test all endpoints');
  
  console.log('\n🔗 Test URLs:');
  console.log(`Website: https://azaklaryapi.com`);
  console.log(`API: https://api.azaklaryapi.com/api/health`);
  console.log(`Admin: https://admin.azaklaryapi.com`);
}

// Performance check
function checkBundleSize() {
  console.log('\n📊 Bundle Size Analysis:');
  console.log('========================');
  
  // Frontend analysis
  const distPath = './dist';
  if (fs.existsSync(distPath)) {
    console.log('\n🖥️  Frontend Bundle:');
    const files = fs.readdirSync(distPath, { withFileTypes: true });
    let totalSize = 0;
    
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(distPath, file.name);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += stats.size;
        
        let emoji = '📄';
        if (file.name.endsWith('.js')) emoji = '⚡';
        else if (file.name.endsWith('.css')) emoji = '🎨';
        else if (file.name.endsWith('.html')) emoji = '🌐';
        
        console.log(`${emoji} ${file.name}: ${sizeKB} KB`);
      }
    });
    
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`📦 Frontend total: ${totalSizeMB} MB`);
  }
  
  // API analysis
  const apiDeployPath = './api-deploy';
  if (fs.existsSync(apiDeployPath)) {
    console.log('\n🔌 API Bundle:');
    const files = fs.readdirSync(apiDeployPath, { withFileTypes: true });
    let totalSize = 0;
    
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(apiDeployPath, file.name);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += stats.size;
        
        let emoji = file.name.endsWith('.js') ? '🔌' : '📄';
        console.log(`${emoji} ${file.name}: ${sizeKB} KB`);
      }
    });
    
    const totalSizeKB = (totalSize / 1024).toFixed(2);
    console.log(`📦 API total: ${totalSizeKB} KB`);
  }
  
  // Admin Panel analysis
  const adminDeployPath = './admin-deploy';
  if (fs.existsSync(adminDeployPath)) {
    console.log('\n👨‍💻 Admin Panel Bundle:');
    const files = fs.readdirSync(adminDeployPath, { withFileTypes: true });
    let totalSize = 0;
    
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(adminDeployPath, file.name);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += stats.size;
        
        let emoji = '📄';
        if (file.name.endsWith('.js')) emoji = '⚡';
        else if (file.name.endsWith('.css')) emoji = '🎨';
        else if (file.name.endsWith('.html')) emoji = '🌐';
        
        console.log(`${emoji} ${file.name}: ${sizeKB} KB`);
      }
    });
    
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`📦 Admin Panel total: ${totalSizeMB} MB`);
  }
}

// Function to upload only critical files
async function uploadCriticalFiles(serverConfig, localPath, description) {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  
  try {
    console.log(`\n📤 Uploading critical files for ${description}...`);
    console.log(`Server: ${serverConfig.host}`);
    console.log(`Username: ${serverConfig.username}`);
    
    await client.access({
      host: serverConfig.host,
      user: serverConfig.username,
      password: serverConfig.password,
      secure: false
    });
    
    console.log('✅ FTP connection established');
    
    // Critical files that must be uploaded for API to work
    const criticalFiles = [
      'web.config',
      'start.bat',
      'appsettings.json',
      'appsettings.Production.json',
      'AzaklarApi.dll',
      'AzaklarApi.deps.json',
      'AzaklarApi.runtimeconfig.json'
    ];
    
    let uploadedCount = 0;
    let failedCount = 0;
    
    for (const file of criticalFiles) {
      const localFilePath = path.join(localPath, file);
      const remoteFilePath = `/${file}`;
      
      if (fs.existsSync(localFilePath)) {
        try {
          console.log(`📄 Uploading critical file: ${file}`);
          await client.uploadFrom(localFilePath, remoteFilePath);
          uploadedCount++;
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.log(`⚠️  Failed to upload: ${file} (${error.message})`);
          failedCount++;
        }
      } else {
        console.log(`⚠️  File not found: ${file}`);
        failedCount++;
      }
    }
    
    console.log(`✅ Critical files upload completed!`);
    console.log(`   📤 Uploaded: ${uploadedCount} files`);
    if (failedCount > 0) {
      console.log(`   ⚠️  Failed: ${failedCount} files`);
    }
    
    return failedCount === 0;
    
  } catch (error) {
    console.error(`❌ ${description} upload failed:`, error.message);
    return false;
  } finally {
    client.close();
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--critical-files')) {
    console.log('🔧 Uploading critical files only...');
    const uploadSuccess = await uploadCriticalFiles(config.api, config.api.localDir, 'API Critical Files');
    if (uploadSuccess) {
      console.log('\n🎉 Critical files uploaded successfully!');
    } else {
      console.log('\n❌ Critical files upload failed!');
      process.exit(1);
    }
    
  } else if (args.includes('--frontend-only')) {
    console.log('🖥️  Building and uploading frontend only...');
    const buildSuccess = await deployFrontend();
    if (buildSuccess) {
      checkBundleSize();
      const uploadSuccess = await uploadToFTP(config.frontend, config.frontend.localDir, 'Frontend');
      if (uploadSuccess) {
        console.log('\n🎉 Frontend deployment completed!');
      } else {
        console.log('\n❌ Frontend upload failed!');
        process.exit(1);
      }
    }
    
  } else if (args.includes('--api-only')) {
    console.log('🔌 Building and uploading API only...');
    const buildSuccess = await deployAPI();
    if (buildSuccess) {
      checkBundleSize();
      const uploadSuccess = await uploadToFTP(config.api, config.api.localDir, 'API');
      if (uploadSuccess) {
        console.log('\n🎉 API deployment completed!');
      } else {
        console.log('\n❌ API upload failed!');
        process.exit(1);
      }
    }
    
  } else if (args.includes('--admin-only')) {
    console.log('👨‍💻 Building and uploading Admin Panel only...');
    const buildSuccess = await deployAdmin();
    if (buildSuccess) {
      checkBundleSize();
      const uploadSuccess = await uploadToFTP(config.admin, config.admin.localDir, 'Admin Panel');
      if (uploadSuccess) {
        console.log('\n🎉 Admin Panel deployment completed!');
      } else {
        console.log('\n❌ Admin Panel upload failed!');
        process.exit(1);
      }
    }
    
  } else if (args.includes('--analyze')) {
    checkBundleSize();
    
  } else {
    // Deploy both
    console.log('🔄 Preparing full deployment...\n');
    
    const frontendSuccess = await deployFrontend();
    const apiSuccess = await deployAPI();
    const adminSuccess = await deployAdmin(); // Add admin deployment
    
    if (frontendSuccess && apiSuccess && adminSuccess) { // Check adminSuccess
      checkBundleSize();
      
      // Upload both to FTP
      console.log('\n🚀 Starting FTP uploads...');
      
      const frontendUpload = await uploadToFTP(config.frontend, config.frontend.localDir, 'Frontend');
      const apiUpload = await uploadToFTP(config.api, config.api.localDir, 'API');
      const adminUpload = await uploadToFTP(config.admin, config.admin.localDir, 'Admin Panel'); // Upload admin
      
      if (frontendUpload && apiUpload && adminUpload) { // Check adminUpload
        console.log('\n🎉 Full deployment completed successfully!');
        console.log('\n🔗 Test URLs:');
        console.log('Website: https://azaklaryapi.com');
        console.log('API: https://api.azaklaryapi.com/api/health');
        console.log('Admin Panel: https://admin.azaklaryapi.com');
      } else {
        console.log('\n❌ Deployment failed!');
        process.exit(1);
      }
    } else {
      console.log('\n❌ Build failed!');
      process.exit(1);
    }
  }
}

// --- GEÇİCİ FTP TESTİ ---
if (process.argv.includes('--ftp-frontend')) {
  uploadToFTP(config.frontend, config.frontend.localDir, 'Frontend (FTP)').then((result) => {
    if (result) {
      console.log('🎉 Frontend FTP ile başarıyla yüklendi!');
    } else {
      console.log('❌ Frontend FTP ile yüklenemedi!');
    }
    process.exit(result ? 0 : 1);
  });
}
// --- ---

main().catch(console.error); 