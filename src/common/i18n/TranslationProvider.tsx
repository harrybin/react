import React, { ReactElement, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';
import { SupportedLanguages } from './SupportedLanguages';
import { Translations } from './Translations';
import { WebExtensionMessage } from './WebExtensionMessage';

/**
 * Wrapper component enabling the 'intl' library to exchange
 * texts with their translations while rendering.
 */
export function TranslationProvider(props: { children: ReactNode }): ReactElement {
    const [langState, _setLangState] = React.useState<SupportedLanguages>(SupportedLanguages.de);
    const translations = Translations;
    const translationsForLocale = translations[langState];
    const messagesForLocale = mapWebExtensionMessages(translationsForLocale);

    return (
        <IntlProvider locale={langState} messages={messagesForLocale}>
            {props.children}
        </IntlProvider>
    );
}

/**
 * Takes an object with string keys and values of @type WebExtensionMessage and
 * transforms it to record of strings, which the i18n provider can understand.
 */
function mapWebExtensionMessages(messages: { [key: string]: WebExtensionMessage }): Record<string, string> {
    const result: Record<string, string> = {};
    Object.keys(messages).forEach((key) => {
        result[key] = messages[key].message;
    });
    return result;
}
