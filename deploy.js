#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ftp from 'basic-ftp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Deploy configurations
const config = {
  frontend: {
    host: '94.73.149.144',
    username: 'u7386832',
    password: 'ki#lH9vh2Id8Fmkj0',
    remoteDir: '/',
    localDir: './dist'
  },
  api: {
    host: '94.73.149.144',
    username: 'apiazaklaryapi',
    password: 'ncAk40W%stGu8net8',
    remoteDir: '/',
    localDir: './api-deploy/AzaklarApi'
  }
};

console.log('🚀 Azaklar İnşaat Deploy Script');
console.log('================================');

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
    
    // Upload files
    await client.uploadFromDir(localPath);
    
    console.log(`✅ ${description} uploaded successfully!`);
    return true;
    
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
    
    // Build .NET API in release mode
    console.log('🔨 Building .NET API in Release mode...');
    execSync('dotnet publish AzaklarApi -c Release -o ./api-deploy/AzaklarApi', { stdio: 'inherit' });
    
    // Copy additional files
    console.log('📁 Copying additional files...');
    
    // Create web.config for IIS
    const webConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
    </handlers>
    <aspNetCore processPath="dotnet" arguments=".\\AzaklarApi.dll" stdoutLogEnabled="true" stdoutLogFile=".\\logs\\stdout" hostingModel="inprocess" />
  </system.webServer>
</configuration>`;
    
    fs.writeFileSync('./api-deploy/AzaklarApi/web.config', webConfigContent);
    console.log('   ✓ web.config for IIS created');
    
    // Create startup script
    const startupScript = `@echo off
echo Starting Azaklar Insaat API...
dotnet AzaklarApi.dll
`;
    fs.writeFileSync('./api-deploy/AzaklarApi/start.bat', startupScript);
    console.log('   ✓ start.bat created');
    
    console.log('✅ .NET API deployment package ready!');
    return true;
    
  } catch (error) {
    console.error('❌ .NET API build failed:', error.message);
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
  
  console.log('\n📝 Deployment Steps:');
  console.log('1. Frontend: Upload ./dist/* to u7386832 account');
  console.log('2. API: Upload ./api-deploy/* to apiazaklaryapi account');
  console.log('3. API: Run "npm install --production" on server');
  console.log('4. API: Run "npm start" to start the API server');
  console.log('5. Test both frontend and API endpoints');
  
  console.log('\n🔗 Test URLs:');
  console.log(`Frontend: http://${config.frontend.host}`);
  console.log(`API Health: http://${config.api.host}:3001/api/health`);
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
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--frontend-only')) {
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
    
  } else if (args.includes('--analyze')) {
    checkBundleSize();
    
  } else {
    // Deploy both
    console.log('🔄 Preparing full deployment...\n');
    
    const frontendSuccess = await deployFrontend();
    const apiSuccess = await deployAPI();
    
    if (frontendSuccess && apiSuccess) {
      checkBundleSize();
      
      // Upload both to FTP
      console.log('\n🚀 Starting FTP uploads...');
      
      const frontendUpload = await uploadToFTP(config.frontend, config.frontend.localDir, 'Frontend');
      const apiUpload = await uploadToFTP(config.api, config.api.localDir, 'API');
      
      if (frontendUpload && apiUpload) {
        console.log('\n🎉 Full deployment completed successfully!');
        console.log('\n🔗 Test URLs:');
        console.log('Frontend: https://azaklaryapi.com');
        console.log('API Health: https://api.azaklaryapi.com/api/health');
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

main().catch(console.error); 