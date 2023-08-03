/**
 * The wrapper format for i18n messages. This format allows integration with weblate as a translation system.
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n/Locale-Specific_Message_reference
 */
export interface WebExtensionMessage {
    message: string;
    description?: string;
}
