import { WebExtensionMessage } from './WebExtensionMessage';

/**
 * A single interface containing keys for all translatable texts of <module> stuff in the application.
 */
export default interface I18nModule {
    //add <module> specific texts here
    module_specific: WebExtensionMessage;
}
