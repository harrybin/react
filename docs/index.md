---
title: React Coding guide
layout: default
---
# React-Frontend Coding guide (DOs and DON&lsquo;Ts)

This coding guide describes additional best practices well as DOs and DON&lsquo;Ts not covered by the [project template](https://github.com/harrybin/react) it belongs to.

## Project template usage
The project template should be used a base for every new react project.

- first of all, read the [README.md](https://github/harrybin/react/#readme) of the project template
- after cloning the template upgrade all packages without breaking changes
- make the project compile and run again

## Make your decisions
- DO decide if the structure of the project matches the preferences of your team
    - do you keep structuring by functionality (components, routes, utils...) or do you prefer structuring by use case, or a first by functionality then by use-case like in the current template?
    - do you prefer test files are located right next to their components like now or do you like to collect them in a test folder recreating the src folder structure in there again?

## Technologies
### Typescript
- **MUST** be used, all source code files inside your `src` folder **must** be typescript files (.ts, .tsx) [except assets and JSON files]<br/>
  **DO NOT** use plain javascript
- **DO NOT** use `any` as type for values etc. unless you there is no chance to define an interface or type for the value.
- **DO** define `Enums` instead of string-union types for type with more than 3 values.

### React
- JSX-Syntax: **DO** pass string values directly instead of using obejct syntax:<br/>
  *param=&ldquo;value&ldquo; ~~param={&lsquo;value&lsquo;}~~*  --> `<Component param="value"/>`
- **DO NOT** create `class components` but ErrorBoundaries
- **DO** create `functional components`
- **DO** use `React.memo` for every component rendered several times with the same props. For middle and large components even rendering twice counts. Also regard re-usage of the component in this matter
- **DO** wrapp functions calculating props for JSX components with `React.useCallback`/`React.useMemo` due to performance issues
- **PREFER** `functional programming` over classes
- **PREFER** `named functions` over `anonymous functions` as the variable names of anonymous functions do not appear in the callstack, the are all named "anonymous" 
- **DO** use `React.context` API instead of `Redux`
- **AVOID** using `React.context reducer`, create individual small `React.contexts` instead<br/>
  (React.context reducer do not behave like Redux, they always update all registred components and their purpose with context api is only for being able to force consitant context objects)
- **DO** start component file names using capitals, all other files (like utils hooks etc.) usually start with small letters
- **DO** use components from the `@harrybin/react-common` library if you have use cases for them. The library also
provides helperfunctions and custom-hooks. For further information take a look at the [Documentation](https://pages.github.com/harrybin/react-common/docs/index.html). The ui-components are documented with [Storybook](https://pages.github.com/harrybin/react-common/).

### MUI
- **DO** use mui components whereever possible
- **DO** use only some plain react components (like `<main/>`, `<></>`) where MUI doesn&lsquo;t cover the usage
- **DO** use MUI components like `<Grid/>`,`<Stack>`, and `<Container/>` for layouting
- **DO NOT** use custom CSS like `flexbox` for layouting unless it&lsquo;s not possible with the MUI components
- **DO** use `className` styling with tss-react
- **DO NOT** use inline `style` styling
- **DO NOT** use `sx` styling unless the component is not rendered very often and the style is very simple.<br/>
  (because `sx` styling is 3 times slower than `className` styling)

## Project
- **DO** keep the console clear of error and warnings
- **DO** fix package versions down to patch level to prevent indeterministic behaviour between builds
- **DO** update packages at least every 2 month



