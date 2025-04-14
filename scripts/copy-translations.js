const fs = require('fs');
const path = require('path');

// Read the source translations file
const sourceFilePath = path.join(__dirname, '../src/i18n/en.json');
const targetFilePath = path.join(__dirname, '../.maestro/translations.js');

try {
  // Read and parse the source JSON file
  const sourceContent = fs.readFileSync(sourceFilePath, 'utf8');
  const translations = JSON.parse(sourceContent);

  // Create the output file content with translations object
  const outputContent = `output.translations = ${JSON.stringify(translations, null, 2)};`;

  // Write the content to the target file
  fs.writeFileSync(targetFilePath, outputContent);

  console.log(
    '✅ Successfully copied translations from src/i18n/en.json to .maestro/translations.js',
  );
} catch (error) {
  console.error('❌ Error copying translations:', error.message);
  process.exit(1);
}
