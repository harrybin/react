import { useIntl } from 'react-intl';
import I18nTexts from './I18nTexts';
import { PrimitiveType } from './PrimitiveType';
import translateText from './translateText';

/**
 * Hook to return a function, which translates the given text identified by its key
 * or returns the key itself, when no text is found.
 */
export function useTranslation(): Translate {
    const intl = useIntl();
    return (textKey: keyof I18nTexts, paramsObj?: Record<string, PrimitiveType>) => {
        return translateText(intl, textKey, paramsObj);
    };
}

/**
 * Result function type allowing to translate a single text in functional components.
 */
export type Translate = (textKey: keyof I18nTexts, paramsObj?: Record<string, PrimitiveType> | undefined) => string;
