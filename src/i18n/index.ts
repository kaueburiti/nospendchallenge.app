import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import de from './de.json';
import en from './en.json';

const localesMap = { en, de}

export const i18n = new I18n(localesMap);

const systemLocal = getLocales()[0].languageCode!;
i18n.locale = Object.keys(localesMap).includes(systemLocal) ? systemLocal : 'en';