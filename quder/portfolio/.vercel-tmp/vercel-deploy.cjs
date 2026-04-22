#!/usr/bin/env node
/**
 * Vercel CLI Deployment Script (Cross-Platform)
 * Usage: node deploy.cjs [project-path] [options]
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';

function log(msg) {
  console.error(msg);
}

function main() {
  log('========================================');
  log('Vercel CLI Project Deployment');
  log('========================================');
  log('');

  const projectPath = process.cwd();
  log(`Project path: ${projectPath}`);
  log('');

  // Check login status
  log('Checking login status...');
  const whoami = spawnSync('vercel', ['whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], shell: isWindows });
  const output = (whoami.stdout || '').trim();
  
  if (whoami.status !== 0 || output.includes('Error') || output.includes('not logged in')) {
    log('');
    log('Error: Not logged in to Vercel');
    log('');
    log('Please run the following command in terminal first:');
    log('  vercel login');
    log('');
    log('Then choose "Continue with GitHub" or "Continue with Email"');
    log('After login completes, run this deploy script again.');
    log('');
    process.exit(1);
  }
  
  log(`Logged in as: ${output}`);
  log('');

  // Build
  log('========================================');
  log('Running build...');
  log('========================================');
  log('');
  
  const buildResult = spawnSync('npm', ['run', 'build'], {
    cwd: projectPath,
    stdio: 'inherit',
    shell: isWindows
  });
  
  if (buildResult.status !== 0) {
    log('');
    log('Build failed! Please fix errors before deploying.');
    process.exit(1);
  }
  
  log('');
  log('========================================');
  log('Build completed successfully!');
  log('========================================');
  log('');

  // Deploy
  log('Starting deployment...');
  log('');
  log('========================================');
  log('Deploying to Vercel...');
  log('========================================');
  log('');

  const deployResult = spawnSync('vercel', ['--prod', '--yes'], {
    cwd: projectPath,
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'pipe'],
    timeout: 300000,
    shell: isWindows
  });

  const deployOutput = (deployResult.stdout || '') + (deployResult.stderr || '');
  log(deployOutput);

  if (deployResult.status !== 0) {
    log('');
    log('Deployment failed!');
    log('');
    log('If you see "command not found" or similar error, please run:');
    log('  vercel login');
    log('');
    process.exit(1);
  }

  // Extract URL
  const urlMatch = deployOutput.match(/https:\/\/[a-zA-Z0-9.-]+\.vercel\.app/gi);
  if (urlMatch && urlMatch.length > 0) {
    const url = urlMatch[urlMatch.length - 1];
    log('');
    log('========================================');
    log('Deployment successful!');
    log('========================================');
    log('');
    log(`Your site is live at: ${url}`);
    log('');
    console.log(JSON.stringify({ status: 'success', url }));
  } else {
    log('');
    log('========================================');
    log('Deployment completed!');
    log('========================================');
    log('');
    log('Check Vercel dashboard for deployment URL');
    log('');
    console.log(JSON.stringify({ status: 'success', message: 'Deployment completed' }));
  }
}

main();
