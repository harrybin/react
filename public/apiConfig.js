/**
 * Change the name of the environment to env and rebuild the app.
 */
window.endpointConfig = {
    name: 'default',
    settings: {},
    env050dev: {
        NAME: 'DEV',
        K8S_NAMESPACE: 'TODO',
        SERVICES_BASE_URL: 'TODO',
        API_ENDPOINT: '/v1/todo',
    },
    env: {
        NAME: 'LOCAL',
        K8S_NAMESPACE: 'default',
        SERVICES_BASE_URL: 'http://localhost:1234',
        THIRD_PARTY_SERVICE_BASE_URL: 'https://api.chucknorris.io',
        API_ENDPOINT: '/v1/todo',
    },
};
