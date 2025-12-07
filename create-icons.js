// Script pour créer des icônes placeholder simples
const fs = require('fs');
const path = require('path');

// PNG 1x1 noir basique en base64
const createSimplePNG = (width, height, color) => {
  // PNG minimal noir (1x1 pixel)
  const blackPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  return blackPNG;
};

const assetsDir = path.join(__dirname, 'assets');

// Créer le dossier assets s'il n'existe pas
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Liste des fichiers à créer
const icons = [
  'icon.png',
  'adaptive-icon.png',
  'splash.png',
  'favicon.png',
  'notification-icon.png'
];

// Créer chaque icône
icons.forEach(icon => {
  const filePath = path.join(assetsDir, icon);
  const png = createSimplePNG();
  fs.writeFileSync(filePath, png);
  console.log(`✅ Created ${icon}`);
});

console.log('\n🎉 All placeholder icons created!');
console.log('⚠️  Note: Ces icônes sont des placeholders 1x1.');
console.log('📝 Pour créer de vraies icônes, voir assets/README.md');
