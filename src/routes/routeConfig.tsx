import { nameof } from '@harrybin/react-common';
import I18nTexts from '../common/i18n/I18nTextsCommon';
import { Routes } from './routes';
import MainRoute from './MainRoute';
// EXAMPLE_START
import TestRoute from './TestRoute';
// EXAMPLE_END

export function getRoutePath(target: Routes): string {
    let routePath = '/';
    if (target === Routes.home) return routePath;
    routePath += Routes[target];
    return routePath;
}

export interface RouteConfigEx {
    /**
     * @type {string}
     */
    name: Routes;
    /**
     * @type {string}
     *
     * e.g. '/test3/:paramId', with optional parameter '/test3/:paramId?'
     */
    path: string;
    /**
     * @type {React.ComponentType<any>}
     */
    getComponent: () => React.ReactElement;

    /**
     * @type {string}
     */
    displayName: string;
    /**
     * Subroutes
     *
     * @type {RouteConfigEx[]}
     */
    routes?: RouteConfigEx[];
}

const routes: RouteConfigEx[] = [
    {
        getComponent: () => <MainRoute />,
        name: Routes.home,
        path: '/',
        displayName: nameof<I18nTexts>('app_title'),
    },
    // EXAMPLE_START
    {
        getComponent: () => <TestRoute />,
        name: Routes.test,
        path: 'test',
        displayName: nameof<I18nTexts>('app_title'),
    },
    // EXAMPLE_END
];

export default routes;
