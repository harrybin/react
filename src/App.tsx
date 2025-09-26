import React from 'react';
import { TranslationProvider } from './common/i18n/TranslationProvider';
import { theme } from './AppTheme';
import ErrorBoundary from './common/errors/ErrorBoundary';
import { BrowserRouter as Router } from 'react-router-dom';
import { MessagesProvider } from './components/messages/MessagesProvider';
import Frame from './components/Frame';
import { CacheProvider, ThemeProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { CssBaseline } from '@mui/material';
import { UserDataProvider } from './contexts/UserContextProvider';
import AppRoutes from './routes/AppRoutes';

export const muiCache = createCache({
    key: 'mui',
    prepend: true,
});

function App(): React.ReactElement {
    return (
        <CacheProvider value={muiCache}>
            <ThemeProvider theme={theme}>
                <CssBaseline>
                    <TranslationProvider>
                        <MessagesProvider>
                            <ErrorBoundary>
                                <Router>
                                    <UserDataProvider>
                                        <Frame>
                                            <AppRoutes />
                                        </Frame>
                                    </UserDataProvider>
                                </Router>
                            </ErrorBoundary>
                        </MessagesProvider>
                    </TranslationProvider>
                </CssBaseline>
            </ThemeProvider>
        </CacheProvider>
    );
}
export default App;
