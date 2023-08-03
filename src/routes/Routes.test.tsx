import React from 'react';
import routes from './routeConfig';
import { MessagesProvider } from '../components/messages/MessagesProvider';
import { TranslationProvider } from '../common/i18n/TranslationProvider';
import { render, waitFor } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material';
import '@testing-library/jest-dom';
import 'vitest-fetch-mock';

describe('routes', () => {
    beforeEach(() => {
        fetchMock.doMock();
    });

    test.each(routes)('test route %p', async (routeComp) => {
        // Arrange
        fetchMock.mockResponse(JSON.stringify({}));

        // Act
        const comp = render(
            <ThemeProvider theme={createTheme({})}>
                <MessagesProvider>
                    <TranslationProvider>{routeComp.getComponent()}</TranslationProvider>
                </MessagesProvider>
            </ThemeProvider>
        );

        // Assert
        await waitFor(() => {
            expect(comp).toBeTruthy();
        });
    });
});
