import { WebExtensionMessage } from './WebExtensionMessage';

/**
 * A single interface containing keys for all translatable texts in the application.
 */
export default interface I18nTexts {
    app_title: WebExtensionMessage;
    loading: WebExtensionMessage;
    error_message_generic: WebExtensionMessage;
    error_message: WebExtensionMessage;
    debug_active: WebExtensionMessage;
    debug_hint: WebExtensionMessage;
    debug_mode: WebExtensionMessage;
    user: WebExtensionMessage;
    firstname: WebExtensionMessage;
    lastname: WebExtensionMessage;
}
