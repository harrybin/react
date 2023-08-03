import { getRoutePath } from './routeConfig';
import { Routes } from './routes';

describe('getRoutePath function', () => {
    it('should return / when called with home', () => {
        expect(getRoutePath(Routes.home)).toBe('/');
    });

    it('should return /test when called with test', () => {
        expect(getRoutePath(Routes.test)).toBe('/test');
    });
});
