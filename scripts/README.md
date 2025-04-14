# Scripts

This directory contains utility scripts for the NoSpendChallenge project.

## Translation Scripts

### copy-translations.ts

This script copies all translations from `src/i18n/en.json` to `.maestro/translations.js`. It's useful for keeping E2E test translations in sync with the app translations.

#### Usage

Run the script with:

```bash
npm run copy:translations
```

This will update the `.maestro/translations.js` file with all the latest translations from the English language file.

The script will:

1. Read the `src/i18n/en.json` file
2. Convert it to the format needed by Maestro (`output.translations = {...}`)
3. Write the resulting file to `.maestro/translations.js`
