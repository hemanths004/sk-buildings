const fs = require('fs');
const path = require('path');

const files = [
  'web/src/pages/HomePage.tsx',
  'web/src/pages/UserDashboard.tsx',
  'web/src/pages/AdminDashboard.tsx',
  'web/src/components/PropertyCard.tsx',
  'web/src/pages/PropertyDetailsPage.tsx'
];

const basePath = '/Users/hemanth/Desktop/sk-buildings';

files.forEach(file => {
  const fullPath = path.join(basePath, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/\._id/g, '.id');
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
