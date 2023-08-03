import endpointConfig from '../../src/configuration/configuration';

export type ApiUrl = string;

/**
 * CN joke service API url type
 *
 * @export
 * @interface ApiUrlChuckNorris
 */
export interface ApiUrlChuckNorris {
    joke: ApiUrl; //GET
    categories: ApiUrl;
    category: (category: string) => ApiUrl; //this way you may also define endpoints for DELETE, PATCH, UPDATE
}

/**
 * URL composer for task service API urls
 *
 * @param {string} baseUrl
 * @return {*}
 */
function getApiUrlChuckNorris(baseUrl: string, serviceVersion?: string) {
    const serviceName = 'jokes';
    const servicePath = `${baseUrl}/${serviceName}` + (serviceVersion ? `/${serviceVersion}` : '');
    return {
        joke: `${servicePath}/random`,
        categories: `${servicePath}/categories`,
        category: (category: string) => `${servicePath}/random?category=${category}`,
    } as ApiUrlChuckNorris;
}

/**
 * DotNetTemplate API url Type
 *
 * @export
 * @interface ApiUrlDotNetTemplate
 */
export interface ApiUrlDotNetTemplate {
    manufactures: ApiUrl; //GET
    manufacturesId: (id: string) => ApiUrl; //this way you may also define endpoints for DELETE, PATCH, UPDATE
    parts: ApiUrl; //this way you may also define endpoints for DELETE, PATCH, UPDATE
    partsId: (id: string) => ApiUrl; //this way you may also define endpoints for DELETE, PATCH, UPDATE
}

/**
 * URL composer for task service API urls
 *
 * @param {string} baseUrl
 * @return {*}
 */
function getApiUrlDotNetTemplate(baseUrl: string, serviceVersion: string = 'v1') {
    const serviceName = '';
    const servicePath =
        `${baseUrl}` + (serviceName ? `/${serviceName}` : '') + (serviceVersion ? `/${serviceVersion}` : '');
    return {
        manufactures: `${servicePath}/manufactures`,
        manufacturesId: (manufacturesId: string) => `${servicePath}/manufactures/${manufacturesId}`,
        parts: `${servicePath}/manufactures`,
        partsId: (partsId: string) => `${servicePath}/parts/${partsId}`,
    } as ApiUrlDotNetTemplate;
}

/**
 * Central api URL access function
 *
 * @export
 * @return {*}
 */
export const ApiUrls = {
    //serviceName: service API url object
    chuckNorrisJokes: getApiUrlChuckNorris(endpointConfig.env.THIRD_PARTY_SERVICE_BASE_URL),
    dotNetTemplateApi: getApiUrlDotNetTemplate(endpointConfig.env.SERVICES_BASE_URL),
};
