#!/usr/bin/env node

// Production environment variables
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3001';
process.env.SMTP_HOST = 'mail.kurumsaleposta.com';
process.env.SMTP_PORT = '587';
process.env.SMTP_SECURE = 'false';
process.env.SMTP_USER = 'kentsel@azaklaryapi.com';
process.env.SMTP_PASS = 'WEBkentsel123456789';
process.env.COMPANY_EMAIL = 'kentsel@azaklaryapi.com';
process.env.COMPANY_NAME = 'Azaklar Yapı Sanayi Tic. Ltd. Şti.';

console.log('🔧 Setting up production environment...');
console.log(`📦 Node.js version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
console.log(`🔌 Port: ${process.env.PORT}`);

// Import and start the main server
import('./index.js').catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}); 