import { IntlShape } from 'react-intl';
import translateText from './translateText';
import I18nTexts from './I18nTexts';
import { vi } from 'vitest';

// Create a mock for the IntlShape
const mockIntl: Partial<IntlShape> = {
    formatMessage: vi.fn() as any,
};

describe('translateText function', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should correctly format message when key exists', () => {
        const textKey = 'existingKey' as keyof I18nTexts;
        const paramsObj = { param1: 'value1' };

        (mockIntl.formatMessage as vi.Mock).mockReturnValue('translated message');

        const result = translateText(mockIntl as IntlShape, textKey, paramsObj);

        expect(mockIntl.formatMessage).toHaveBeenCalledWith({ id: textKey }, paramsObj);
        expect(result).toEqual('translated message');
    });

    it('should return the key when key does not exist', () => {
        const textKey = 'nonExistingKey' as keyof I18nTexts;
        (mockIntl.formatMessage as vi.Mock).mockImplementation(() => {
            throw new Error('Key not found');
        });

        const result = translateText(mockIntl as IntlShape, textKey);

        expect(mockIntl.formatMessage).toHaveBeenCalledWith({ id: textKey }, undefined);
        expect(result).toEqual(textKey);
    });

    it('should log a warning when in development mode', () => {
        const textKey = 'nonExistingKey' as keyof I18nTexts;
        (mockIntl.formatMessage as vi.Mock).mockImplementation(() => {
            throw new Error('Key not found');
        });

        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        process.env.NODE_ENV = 'development';
        translateText(mockIntl as IntlShape, textKey);

        expect(consoleWarnSpy).toHaveBeenCalled();

        consoleWarnSpy.mockRestore();
    });

    it('should not log a warning when not in development mode', () => {
        const textKey = 'nonExistingKey' as keyof I18nTexts;
        (mockIntl.formatMessage as vi.Mock).mockImplementation(() => {
            throw new Error('Key not found');
        });

        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        process.env.NODE_ENV = 'production';
        translateText(mockIntl as IntlShape, textKey);

        expect(consoleWarnSpy).not.toHaveBeenCalled();

        consoleWarnSpy.mockRestore();
    });
});
