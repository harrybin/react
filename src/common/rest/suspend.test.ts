import { suspend } from './suspend';

describe('suspend', () => {
    it('should return a function that throws when the promise is still pending', () => {
        const pendingPromise = new Promise((resolve, reject) => {});
        const suspendedPromise = suspend(pendingPromise);

        expect(suspendedPromise.query).toThrow();
    });

    it('should throw the error when the promise is rejected', async () => {
        const error = new Error('test error');
        const rejectedPromise = Promise.reject(error);
        const suspendedPromise = suspend(rejectedPromise);

        try {
            // Wait for the promise to be rejected
            await rejectedPromise.catch(() => {});
            suspendedPromise.query();
        } catch (e) {
            expect(e).toBe(error);
        }
    });

    it('should return the result when the promise is resolved', async () => {
        const result = 'test result';
        const resolvedPromise = Promise.resolve(result);
        const suspendedPromise = suspend(resolvedPromise);

        // Wait for the promise to be resolved
        await resolvedPromise;

        expect(suspendedPromise.query()).toBe(result);
    });
});
