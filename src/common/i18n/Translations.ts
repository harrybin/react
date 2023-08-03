import * as deMessagesCommon from './de/i18nCommon.json';
import * as deMessagesModule from './de/i18nModule.json';
import * as enMessagesCommon from './en/i18nCommon.json';
import * as enMessagesModule from './en/i18nModule.json';

/**
 * A single object containing all translation texts.
 * This is required by the TranslationProvider to pass
 * these texts to the 'intl' library.
 */
export const Translations = {
    de: { ...deMessagesCommon, ...deMessagesModule },
    en: { ...enMessagesCommon, ...enMessagesModule },
};
