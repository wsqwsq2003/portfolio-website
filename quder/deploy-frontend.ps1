# PowerShell script to deploy frontend to GitHub Pages

Write-Host "Building frontend..." -ForegroundColor Green

# Build the frontend
cd frontend
npm install
npm run build

# Go to dist folder
cd dist

# Create .nojekyll file
New-Item -ItemType File -Name ".nojekyll" -Force | Out-Null

# Initialize git and push to gh-pages
Write-Host "Deploying to GitHub Pages..." -ForegroundColor Green

git init
git add -A
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages

# Note: You may need to enter your GitHub credentials here
git push -f https://github.com/Wangshou123/qqqqq-demo.git gh-pages

Write-Host "Done! Your site will be available at:" -ForegroundColor Green
Write-Host "https://wangshou123.github.io/qqqqq-demo" -ForegroundColor Cyan

cd ../..
