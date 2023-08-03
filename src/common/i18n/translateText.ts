import { IntlShape } from 'react-intl';
import I18nTexts from './I18nTexts';
import { PrimitiveType } from './PrimitiveType';

export default function translateText(
    intl: IntlShape,
    textKey: keyof I18nTexts,
    paramsObj?: Record<string, PrimitiveType>
) {
    try {
        return intl.formatMessage({ id: textKey }, paramsObj);
    } catch (error) {
        // Do not log in test or production
        if (process.env.NODE_ENV === 'development') {
            console.warn(`Translation text key ${textKey} not found.`);
        }
        return textKey;
    }
}
