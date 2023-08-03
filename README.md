# react
## Purpose

This is a template for new web UI projects, based on **React** and **Material UI**.

## Prerequisits
Ensure you have at least the LTS version of nodejs installed. (current latest non LTS is v20.5.x)
It's recommended to use `nvm` for installing/managing node.

## Dependencies

The intention regarding dependencies is, to keep them minimal.

-   [React](https://www.npmjs.com/package/react)
-   Material UI [Core](https://www.npmjs.com/package/@material-ui/core) & [Icons](https://www.npmjs.com/package/@material-ui/icons)
-   [Typescript 5](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)
-   [Vite](https://vitejs.dev)
-   [Vite Test](https://vitest.dev) for unit testing
-   [Prettier](https://www.npmjs.com/package/prettier) for code formatting/linting

## Setup locally for developers
To get started, install the dependencies and complete the template setup by running the following command:
 ```sh
npm install
```
Once the installation is complete, the template generator will automatically start to set up the template according to your requirements.
These modes are available:
### Template Generator Modes

⚡ Cleared Mode:  This mode generates the necessary boilerplate code you need to start. It just contains the necessary files and no examples. This mode is suitable for developers who want to start directly/dont need examples.

🛠️ Intermediate Mode:  Intermediate mode provides boilerplate code with commented examples. This mode is suitable if you want to look up example code/components without actually integrating them into your app.

🚀 Full Mode:  Contains a lot of examples. While the examples included in Full mode are not necessarily needed in your app, they can be helpful for demonstrating various topics such as API calls, routing, and best practices.

🔥 None Mode: This mode is useful if you want to make changes regarding the template

### Development
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
    Ensure DockerDesktop is running properly.
    If you get the error 
    > Error: No Docker client strategy found
 
 - Dotnet 7 is installed   
   See [REAMDE.md](../dotnetcore/README.md) of the dotnet


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
Assuming the dotNet is located right bedise this project `../dotnetcore` you can start both parallel using
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
Generate new APIs with 

```sh
# Optional: Edit service endpoint in api/generator.ts
npm run api:generate
```

Or use the debug target `Launch API Generator` (uses default params/arguments)

---
## Initial setup
- when using **atlassian JIRA** extension:
    edit `.vscode/settings.json`: search for the "atlascode.jira" settings and replace all occurrences of **XXX** with the abbreviation of your project used in JIRA (like 'REC' for recon, 'EPS' ...)
- set up your environments (LOCAL, DEV, INT, PROD) in `public/apiConfig.js`
  - change the key of the environment your want to use to `env`
  - import configuration in components via importing the default export from `src/configuration/configuration`
---
## Fruther information you may find at certain locations

- [./src/common/i18n/README.md](./src/common/i18n/README.md)
- [./ssoRedirect/README.md](./src/ssoRedirect/README.md)


---
## Accessing Dev-Server running in WSL2 from another PC/mobile device

WSL has its own network adapter. So if you need to access the Dev-Server from another device in your local network you need to do the following two steps:
1. Add **portforwarding** to WSL:
    - open a powershell as administrator
    - add the fowarding rule like: (replace `192.168.178.42` by the ip addess of your PC)
    ```ps
    netsh interface portproxy add v4tov4 listenport=3000 listenaddress=192.168.178.42 connectport=3000 connectaddress=$($(wsl hostname -I).Trim())
    ```      
    - see if the rule was properly set:
    ```ps
    netsh interface portproxy show v4tov4
    ```
    (if you like to remove/delete later on the portforwarding use "`netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=192.168.178.42`")

2. Add a **firewall rule** to the windows firewall allowing connections to port 3000:
    - open "Windows Defender Firewall" settings by running `wf.msc` (e.g. Windows + R)
    - select "Incoming Rules" (on the left)
    - click "New rule..." (on the right)
      - select "Port" --> Next
      - enter "3000" --> Next
      - keep "Allow connection" --> Next
      - deselect "Public" --> Next
      - gice it a name like "Web-Debug on Port 3000" --> Done

