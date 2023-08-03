export enum EnvName {
    LOCAL = 'LOCAL',
    DEV = 'DEV',
}
export interface Environment {
    NAME: EnvName;
    SERVICES_BASE_URL: string;
    THIRD_PARTY_SERVICE_BASE_URL: string;
    K8S_NAMESPACE: string;
    API_ENDPOINT: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EnvSettings {}

export interface EndpointConfig {
    name: string;
    env: Environment;
    settings: EnvSettings;
}

export type WindowConfig = Window & typeof globalThis & { endpointConfig: EndpointConfig };

const endpointConfig = (window as WindowConfig).endpointConfig;
if (!endpointConfig) throw new Error('Endpoint config could not be loaded. Check public/apiConfig.js');

endpointConfig.env.SERVICES_BASE_URL = endpointConfig.env.SERVICES_BASE_URL || document.location.origin;

export default {
    ...endpointConfig,
    apiEndpoint: `${endpointConfig.env.SERVICES_BASE_URL}${endpointConfig.env.API_ENDPOINT}`,
};
