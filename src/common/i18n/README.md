# Localization

We are using WebExtensionMessage format for localization strings to be able to added additional info for tranlater using a `description` beside the actual `message`.
The file `I18nTexts.ts` contains/extends interface definitions for the localization string messages to be used when using the locaization for getting rid of "magic strings".

## Initially TODO
- rename the `i18nModule.json`,  `I18nTextsModule.ts` files and their usages to match a module name/semantic context of your project


## Do's
- add further `<module>.json` and `I18nTexts<Module>.ts` files for further modules/semantic contexts as needed

## Don'ts
- do NOT use single `i18n.json` and `I18nTexts.ts` files for all localizatoin strings of your project. Editing huge json files ist slow in most IDEs and huge json files cause more git merge conflicts when external translation tools are used.
