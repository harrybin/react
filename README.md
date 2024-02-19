# react
## Purpose

This is a template for new web UI projects, based on **React** and **Material UI**.

## Prerequisits
Ensure you have at least the LTS version of nodejs installed. (current non LTS is v20.5.x). 
It's recommended to use `nvm` for installing/managing node.

## Dependencies

The intention regarding dependencies is, to keep them minimal.

-   [React](https://www.npmjs.com/package/react)
-   Material UI [Core](https://www.npmjs.com/package/@material-ui/core) & [Icons](https://www.npmjs.com/package/@material-ui/icons)
-   [Typescript 5](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)
-   [Vite](https://vitejs.dev)
-   [Vite Test](https://vitest.dev) for unit testing
-   [@harrybin/react-common](https://github.com/harrybin/react-common)
-   [Prettier](https://www.npmjs.com/package/prettier) for code formatting/linting

## Setup locally for developers
To get started, install the dependencies and complete the template setup by running the following command:
 ```sh
npm install
```

## Template Generator 
This template comes with a script enabling you to decide how you like to start/use the template.
The following modes are awailable:

⚡ Cleared Mode:  This mode generates the necessary boilerplate code you need to start. It just contains the necessary files and no examples. This mode is suitable for developers who want to start directly/dont need examples.

🛠️ Intermediate Mode:  Intermediate mode provides boilerplate code with commented examples. This mode is suitable if you want to look up example code/components without actually integrating them into your app.

🚀 Full Mode:  Contains a lot of examples. While the examples included in Full mode are not necessarily needed in your app, they can be helpful for demonstrating various topics such as API calls, routing, and best practices.

🔥 None Mode: This mode is useful if you want to make changes regarding the template

For running the generator script execute:
```shell
pwsh .\tools\Run-TemplateGenerator.ps1
```
---

### Development
Before starting development please have a look at [common react coding guidelines](https://github.com/harrybin/react/blob/main/docs/index.md).
Run the app locally in development mode

```sh
npm start
```

Run all unit tests locally

```sh
npm run test
```

Run all unit tests in watch-mode

```sh
npm run test:watch
```

Run all unit tests and create a test-coverage report

```sh
npm run test:coverage
```


### Playwright Testing

Playwright is mainly used for integration and e2e tests. The local playwright test setup is based on [node-testcontainers]
(https://node.testcontainers.org/). The playwright tests are located in the `playwrightTests` folder. Before these tests 
start to run, a new testcontainer will be created(ensure that the docker daemon is running) The testcontainers can be
used to create a test environment. The containers are defined in the `docker-compose.yaml` file. Make sure to configure
the ports for your container correctly. In some cases it makes sense to define only the container port, since the host port 
will be choosen at runtime(prevent port conflicts). If you need to know the port that is choosen in the test, you can
retrieve it with `getMappedPort(container port)` . In the example tests the setup consists of an api container
(dotnet template) and an postgres container. The Advantage of this approach: the containers restart whenever you run a 
new testcommand, therefore you have always a clean environment before starting the tests.
#### Prerequisits
 - Playwright     
    If you run playwright the first time you may need to execute first:
    ```sh
    npx playwright install
    ```
 - Docker   
    Ensure Docker is running properly.
    If you get the error 
    > Error: No Docker client strategy found
 
 - Dotnet X is installed   
   your dotnet backend up and runnig


#### Here are the main playwright commands:

Run tests headless
```sh
npm run play
```

Run tests in ui mode

```sh
npm run play:ui
```

Debug Tests with playwright inspector

```sh
npm run play:debug
```

Use Codegenerator to generate tests
```sh
npm run play:generate
```

> Hint: to make it properly run in WSL you may need to install chrome (or ans other browser) in wsl:
> ```sh
> wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
> sudo apt -y install ./google-chrome-stable_current_amd64.deb
> ```


## Build/Deployment
The deployment is many done in the CI.
Run a local production build (only for testing production build ⚠️)
In case you like/need to test a production build run:
```shell
npm run build
```
then you wil find the deployment ready app in the `dist` folder.

If you the productive build shows the error
> FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory

You need to allow your node instance to use more memory by stating
```shell
export NODE_OPTIONS=--max-old-space-size=4096
```
before `npm run build`.
In case you need it more often consider adding that export to the npm build target:
`"build": "export NODE_OPTIONS=--max-old-space-size=4096 && vite build"`.


### Testing your production build
Since using vite you may test your local production build using
```sh
npm run preview
```
This starts a vite web server serving the app from the dist folder (your last local `npm run build` result)



## Accessing BE dotnet API
If you also use the dotNet you may like to run it beside this UI project and directly use it's API as an example.
Assuming the dotNet is located right bedise this project `../<yourDotnetProject>` you can start both parallel using
```sh
npm run tye
```


### Build and run Docker images

Build the image locally

```sh
docker build -t <image-tag> .
```

Run the image locally, on port 8080

```sh
docker run -d -p 8080:80 <image-tag>
```

### Add translation texts

1. Register new translation key in `src/common/i18n/I18nTexts.ts`
2. Add key with translation to the respective JSON files in `src/common/i18n/<language>`
3. Use the `useTranslation` hook in the component and pass the key to it, e.g.:

```tsx
const translate = useTranslation();
return (<label>{translate('translation-key')}</label>);
```

### Test a component

We use [Jest](https://jestjs.io) as a test runner and [react-testing-library](https://testing-library.com/docs/react-testing-library/intro/) to help with component testing.

### Generate new API models

The [openapi-generator](https://github.com/OpenAPITools/openapi-generator) is used to generate APIs based on a backend service's API definition. It will always delete and re-create existing APIs.
Generate new APIs with (:warning: TODO: you need to adjust the generator script to match your BE services)

```sh
# Optional: Edit service endpoint in api/generator.ts
npm run api:generate
```

Or use the debug target `Launch API Generator` (uses default params/arguments)

---
## Initial setup
- set up your environments (LOCAL, DEV, INT, PROD) in `public/apiConfig.js`
  - change the key of the environment your want to use to `env`
  - import configuration in components via importing the default export from `src/configuration/configuration`
---
## Fruther information you may find at certain locations

- [./src/common/i18n/README.md](./src/common/i18n/README.md)


---
